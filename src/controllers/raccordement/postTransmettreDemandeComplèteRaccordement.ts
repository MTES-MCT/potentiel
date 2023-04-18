import { createReadStream } from 'fs';
import {
  GestionnaireNonRéférencéError,
  PermissionTransmettreDemandeComplèteRaccordement,
  PlusieursGestionnairesRéseauPourUnProjetError,
  consulterGestionnaireRéseauQueryHandlerFactory,
  transmettreDemandeComplèteRaccordementCommandHandlerFactory,
  transmettreDemandeComplèteRaccordementUseCaseFactory,
} from '@potentiel/domain';
import { findProjection } from '@potentiel/pg-projections';
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
import { loadAggregate, publish } from '@potentiel/pg-event-sourcing';
import { addQueryParams } from '../../helpers/addQueryParams';
import { logger } from '@core/utils';
import { upload as uploadMiddleware } from 'src/controllers/upload';
// import { upload } from '@potentiel/file-storage';

const transmettreDemandeComplèteRaccordementCommand =
  transmettreDemandeComplèteRaccordementCommandHandlerFactory({
    loadAggregate,
    publish,
  });

const consulterGestionnaireRéseauQuery = consulterGestionnaireRéseauQueryHandlerFactory({
  find: findProjection,
});
const transmettreDemandeComplèteRaccordement = transmettreDemandeComplèteRaccordementUseCaseFactory(
  {
    transmettreDemandeComplèteRaccordementCommand,
    consulterGestionnaireRéseauQuery,
  },
);

const schema = yup.object({
  params: yup.object({ projetId: yup.string().uuid().required() }),
  body: yup.object({
    codeEIC: yup.string().required(),
    référenceDossierRaccordement: yup.string().required(),
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
        notFoundResponse({ request, response, ressourceTitle: 'Projet' }),
    },
    async (request, response) => {
      const {
        user,
        params: { projetId },
        body: { codeEIC, dateQualification, référenceDossierRaccordement },
        file,
      } = request;

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
        const filePath = '';
        const content = createReadStream(request.file!.path);

        await upload(filePath, content);

        await transmettreDemandeComplèteRaccordement({
          identifiantProjet,
          identifiantGestionnaireRéseau: { codeEIC },
          dateQualification,
          référenceDossierRaccordement,
        });

        return response.redirect(
          addQueryParams(routes.GET_LISTE_DOSSIERS_RACCORDEMENT(projetId), {
            success: 'La demande complète de raccordement a bien été enregistrée',
          }),
        );
      } catch (error) {
        if (
          error instanceof PlusieursGestionnairesRéseauPourUnProjetError ||
          error instanceof GestionnaireNonRéférencéError
        ) {
          return response.redirect(
            addQueryParams(routes.GET_TRANSMETTRE_DEMANDE_COMPLETE_RACCORDEMENT_PAGE(projetId), {
              error: error.message,
            }),
          );
        }

        logger.error(error);

        return errorResponse({ request, response });
      }
    },
  ),
);
