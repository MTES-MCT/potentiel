import { createReadStream } from 'fs';
import {
  DomainUseCase,
  PermissionTransmettreDemandeComplèteRaccordement,
  convertirEnIdentifiantGestionnaireRéseau,
  convertirEnIdentifiantProjet,
  convertirEnRéférenceDossierRaccordement,
  estUnRawIdentifiantProjet,
} from '@potentiel/domain';
import routes from '@routes';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import {
  errorResponse,
  iso8601DateToDateYupTransformation,
  notFoundResponse,
  unauthorizedResponse,
  vérifierPermissionUtilisateur,
} from '../helpers';
import { Project, UserProjects } from '@infra/sequelize/projectionsNext';
import { addQueryParams } from '../../helpers/addQueryParams';
import { logger } from '@core/utils';
import { upload as uploadMiddleware } from '../upload';

import { mediator } from 'mediateur';
import { DomainError } from '@potentiel/core-domain';
import { isSome } from '@potentiel/monads';

const schema = yup.object({
  params: yup.object({ identifiantProjet: yup.string().required() }),
  body: yup.object({
    identifiantGestionnaireRéseau: yup.string().required(),
    referenceDossierRaccordement: yup.string().required(),
    dateQualification: yup
      .date()
      .required(`La date de qualification est obligatoire`)
      .nullable()
      .transform(iso8601DateToDateYupTransformation)
      .typeError(`La date de qualification n'est pas valide`),
  }),
});

v1Router.post(
  routes.POST_TRANSMETTRE_DEMANDE_COMPLETE_RACCORDEMENT(),
  uploadMiddleware.single('file'),
  vérifierPermissionUtilisateur(PermissionTransmettreDemandeComplèteRaccordement),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response }) =>
        response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(request.params.projetId), {
            error: `Une erreur est survenue lors de la transmission de la demande complète de raccordement, merci de vérifier les informations communiquées.`,
          }),
        ),
    },
    async (request, response) => {
      const {
        user,
        params: { identifiantProjet },
        body: {
          identifiantGestionnaireRéseau,
          dateQualification,
          referenceDossierRaccordement: référenceDossierRaccordement,
        },
        file,
      } = request;

      if (!file) {
        return response.redirect(
          addQueryParams(
            routes.GET_TRANSMETTRE_DEMANDE_COMPLETE_RACCORDEMENT_PAGE(identifiantProjet),
            {
              error: `Vous devez joindre l'accusé de réception de la demande complète de raccordement`,
            },
          ),
        );
      }

      if (!estUnRawIdentifiantProjet(identifiantProjet)) {
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
      }

      const identifiantProjetValueType = convertirEnIdentifiantProjet(identifiantProjet);

      const projet = await Project.findOne({
        where: {
          appelOffreId: identifiantProjetValueType.appelOffre,
          periodeId: identifiantProjetValueType.période,
          familleId: isSome(identifiantProjetValueType.famille) ?? undefined,
          numeroCRE: identifiantProjetValueType.numéroCRE,
        },
        attributes: ['id'],
      });

      if (!projet) {
        return notFoundResponse({
          request,
          response,
          ressourceTitle: 'Projet',
        });
      }

      if (user.role === 'porteur-projet') {
        const porteurAAccèsAuProjet = !!(await UserProjects.findOne({
          where: { projectId: projet.id, userId: user.id },
        }));

        if (!porteurAAccèsAuProjet) {
          return unauthorizedResponse({
            request,
            response,
            customMessage: `Vous n'avez pas accès à ce projet.`,
          });
        }
      }

      try {
        await mediator.send<DomainUseCase>({
          type: 'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
          data: {
            identifiantProjet: identifiantProjetValueType,
            identifiantGestionnaireRéseau: convertirEnIdentifiantGestionnaireRéseau(
              identifiantGestionnaireRéseau,
            ),
            référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(
              référenceDossierRaccordement,
            ),
            dateQualification,
            accuséRéception: {
              format: file.mimetype,
              content: createReadStream(file.path),
            },
          },
        });

        return response.redirect(
          routes.SUCCESS_OR_ERROR_PAGE({
            success: 'La demande complète de raccordement a bien été enregistrée',
            redirectUrl: routes.GET_LISTE_DOSSIERS_RACCORDEMENT(identifiantProjet),
            redirectTitle: 'Retourner sur la page raccordement',
          }),
        );
      } catch (error) {
        if (error instanceof DomainError) {
          return response.redirect(
            addQueryParams(
              routes.GET_TRANSMETTRE_DEMANDE_COMPLETE_RACCORDEMENT_PAGE(identifiantProjet),
              {
                error: error.message,
              },
            ),
          );
        }

        logger.error(error);

        return errorResponse({ request, response });
      }
    },
  ),
);
