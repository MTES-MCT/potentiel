import { createReadStream } from 'fs';
import { mediator } from 'mediateur';
import {
  PermissionTransmettreDemandeComplèteRaccordement,
  convertirEnIdentifiantProjet,
  convertirEnRéférenceDossierRaccordement,
  estUnRawIdentifiantProjet,
  DomainUseCase,
  RawIdentifiantProjet,
  convertirEnDateTime,
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
import { DomainError } from '@potentiel/core-domain';
import { isSome } from '@potentiel/monads';

const schema = yup.object({
  params: yup.object({
    identifiantProjet: yup.string().required(),
    reference: yup.string().required(),
  }),
  body: yup.object({
    referenceDossierRaccordement: yup
      .string()
      .required(`La référence du dossier de raccordement est obligatoire.`),
    dateQualification: yup
      .date()
      .required(`La date de qualification est obligatoire.`)
      .nullable()
      .transform(iso8601DateToDateYupTransformation)
      .typeError(`La date de qualification n'est pas valide.`),
  }),
});

v1Router.post(
  routes.POST_MODIFIER_DEMANDE_COMPLETE_RACCORDEMENT(),
  uploadMiddleware.single('file'),
  vérifierPermissionUtilisateur(PermissionTransmettreDemandeComplèteRaccordement),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response, error }) =>
        response.redirect(
          addQueryParams(
            routes.GET_MODIFIER_DEMANDE_COMPLETE_RACCORDEMENT_PAGE(
              request.params.identifiantProjet as RawIdentifiantProjet,
              request.params.reference,
            ),
            {
              error: `Votre dossier de raccordement n'a pas pu être mise à jour dans Potentiel. ${error.errors.join(
                ' ',
              )}`,
            },
          ),
        ),
    },
    async (request, response) => {
      const {
        user,
        params: { identifiantProjet, reference },
        body: { dateQualification, referenceDossierRaccordement },
        file,
      } = request;

      if (!estUnRawIdentifiantProjet(identifiantProjet)) {
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
      }

      if (!file) {
        return response.redirect(
          addQueryParams(
            routes.GET_MODIFIER_DEMANDE_COMPLETE_RACCORDEMENT_PAGE(identifiantProjet, reference),
            {
              error: `Vous devez joindre l'accusé de réception de la demande complète de raccordement`,
            },
          ),
        );
      }

      const identifiantProjetValueType = convertirEnIdentifiantProjet(identifiantProjet);

      const projet = await Project.findOne({
        where: {
          appelOffreId: identifiantProjetValueType.appelOffre,
          periodeId: identifiantProjetValueType.période,
          familleId: isSome(identifiantProjetValueType.famille)
            ? identifiantProjetValueType.famille
            : '',
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

      // TODO: Avoir 2 use case exécutés dans un controller n'est pas normal il faut avoir un controller dédié pour cette action
      try {
        const nouvelleRéférenceDossierRaccordementValueType =
          convertirEnRéférenceDossierRaccordement(referenceDossierRaccordement);

        const référenceDossierRaccordementActuelle =
          convertirEnRéférenceDossierRaccordement(reference);
        if (
          !nouvelleRéférenceDossierRaccordementValueType.estÉgaleÀ(
            référenceDossierRaccordementActuelle,
          )
        ) {
          await mediator.send<DomainUseCase>({
            type: 'MODIFIER_RÉFÉRENCE_DOSSIER_RACCORDEMENT_USE_CASE',
            data: {
              identifiantProjet: identifiantProjetValueType,
              nouvelleRéférenceDossierRaccordement: nouvelleRéférenceDossierRaccordementValueType,
              référenceDossierRaccordementActuelle: référenceDossierRaccordementActuelle,
            },
          });
        }

        await mediator.send<DomainUseCase>({
          type: 'MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
          data: {
            identifiantProjet: identifiantProjetValueType,
            référenceDossierRaccordement: nouvelleRéférenceDossierRaccordementValueType,
            dateQualification: convertirEnDateTime(dateQualification),
            accuséRéception: {
              format: file.mimetype,
              content: createReadStream(file.path),
            },
          },
        });

        return response.redirect(
          routes.SUCCESS_OR_ERROR_PAGE({
            success: 'La demande complète de raccordement est bien mise à jour',
            redirectUrl: routes.GET_LISTE_DOSSIERS_RACCORDEMENT(identifiantProjet),
            redirectTitle: 'Retourner sur la page raccordement',
          }),
        );
      } catch (error) {
        if (error instanceof DomainError) {
          return response.redirect(
            addQueryParams(
              routes.GET_MODIFIER_DEMANDE_COMPLETE_RACCORDEMENT_PAGE(
                identifiantProjet,
                referenceDossierRaccordement,
              ),
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
