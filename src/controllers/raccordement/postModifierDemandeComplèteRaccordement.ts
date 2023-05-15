import { createReadStream } from 'fs';
import {
  DossierRaccordementNonRéférencéError,
  PermissionTransmettreDemandeComplèteRaccordement,
  consulterDossierRaccordementQueryHandlerFactory,
  modifierDemandeComplèteRaccordementCommandHandlerFactory,
  modifierDemandeComplèteRaccordementUseCaseFactory,
  createModifierDemandeComplèteRaccordementCommand,
  formatIdentifiantProjet,
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
import {
  remplacerAccuséRéceptionDemandeComplèteRaccordement,
  renommerPropositionTechniqueEtFinancière,
} from '@potentiel/adapter-domain';
import { findProjection } from '@potentiel/pg-projections';

const consulterDossierRaccordementQuery = consulterDossierRaccordementQueryHandlerFactory({
  find: findProjection,
});

const modifierDemandeComplèteRaccordementCommand =
  modifierDemandeComplèteRaccordementCommandHandlerFactory({
    loadAggregate,
    publish,
  });
import { extname, join } from 'path';
import { createReadStream } from 'fs';
import { deleteFile, getFiles, renameFile, upload } from '@potentiel/file-storage';
import { mediator } from 'mediateur';

const modifierDemandeComplèteRaccordement = modifierDemandeComplèteRaccordementUseCaseFactory({
  consulterDossierRaccordementQuery,
  modifierDemandeComplèteRaccordementCommand,
  remplacerAccuséRéceptionDemandeComplèteRaccordement,
  renommerPropositionTechniqueEtFinancière,
});

const schema = yup.object({
  params: yup.object({
    projetId: yup.string().uuid().required(),
    reference: yup.string().required(),
  }),
  body: yup.object({
    nouvelleReference: yup.string().required(),
    dateQualification: yup
      .date()
      .required(`La date de qualification est obligatoire`)
      .nullable()
      .transform(iso8601DateToDateYupTransformation)
      .typeError(`La date de qualification n'est pas valide`),
  }),
});

v1Router.post(
  routes.POST_MODIFIER_DEMANDE_COMPLETE_RACCORDEMENT(),
  uploadMiddleware.single('file'),
  vérifierPermissionUtilisateur(PermissionTransmettreDemandeComplèteRaccordement),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response }) =>
        response.redirect(
          addQueryParams(
            routes.GET_MODIFIER_DEMANDE_COMPLETE_RACCORDEMENT_PAGE(
              request.params.projetId,
              request.params.reference,
            ),
            {
              error: `Une erreur est survenue lors de la transmission de la demande complète de raccordement, merci de vérifier les informations communiquées.`,
            },
          ),
        ),
    },
    async (request, response) => {
      const {
        user,
        params: { projetId, reference },
        body: { dateQualification, nouvelleReference },
        file,
      } = request;

      if (!file) {
        return response.redirect(
          addQueryParams(
            routes.GET_MODIFIER_DEMANDE_COMPLETE_RACCORDEMENT_PAGE(projetId, reference),
            {
              error: `Vous devez joindre l'accusé de réception de la demande complète de raccordement`,
            },
          ),
        );
      }

      const projet = await Project.findByPk(projetId, {
        attributes: ['appelOffreId', 'periodeId', 'familleId', 'numeroCRE'],
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
          where: { projectId: projetId, userId: user.id },
        }));

        if (!porteurAAccèsAuProjet) {
          return unauthorizedResponse({
            request,
            response,
            customMessage: `Vous n'avez pas accès à ce projet.`,
          });
        }
      }

      const identifiantProjet = {
        appelOffre: projet.appelOffreId,
        période: projet.periodeId,
        famille: projet.familleId,
        numéroCRE: projet.numeroCRE,
      };

      try {
        await modifierDemandeComplèteRaccordement({
          identifiantProjet,
          dateQualification,
          nouvelleRéférence: nouvelleReference,
          ancienneRéférence: reference,
          nouveauFichier: {
            format: file.mimetype,
            content: createReadStream(file.path),
          },
        });
        await mediator.send(
          createModifierDemandeComplèteRaccordementCommand({
            identifiantProjet,
            dateQualification,
            nouvelleReference,
            referenceActuelle: reference,
          }),
        );

        return response.redirect(
          routes.SUCCESS_OR_ERROR_PAGE({
            success: 'La demande complète de raccordement est bien mise à jour',
            redirectUrl: routes.GET_LISTE_DOSSIERS_RACCORDEMENT(projetId),
            redirectTitle: 'Retourner sur la page raccordement',
          }),
        );
      } catch (error) {
        if (error instanceof DossierRaccordementNonRéférencéError) {
          return response.redirect(
            addQueryParams(
              routes.GET_MODIFIER_DEMANDE_COMPLETE_RACCORDEMENT_PAGE(projetId, reference),
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
