import {
  GestionnaireNonRéférencéError,
  PermissionModifierGestionnaireRéseauProjet,
  modifierGestionnaireRéseauProjetCommandHandlerFactory,
} from '@potentiel/domain';
import routes from '@routes';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import {
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
  vérifierPermissionUtilisateur,
} from '../helpers';
import { Project, UserProjects } from '@infra/sequelize/projectionsNext';
import { addQueryParams } from '../../helpers/addQueryParams';
import { logger } from '@core/utils';
import { publish } from '@potentiel/pg-event-sourcing';

const modifierGestionnaireRéseauProjet = modifierGestionnaireRéseauProjetCommandHandlerFactory({
  publish,
});

const schema = yup.object({
  params: yup.object({ projetId: yup.string().uuid().required() }),
  body: yup.object({
    codeEIC: yup.string().required(),
  }),
});

v1Router.post(
  routes.POST_MODIFIER_GESTIONNAIRE_RESEAU_PROJET(),
  vérifierPermissionUtilisateur(PermissionModifierGestionnaireRéseauProjet),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response }) => {
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
      },
    },
    async (request, response) => {
      const {
        user,
        params: { projetId },
        body: { codeEIC },
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
        await modifierGestionnaireRéseauProjet({
          identifiantProjet,
          identifiantGestionnaireRéseau: codeEIC,
        });

        return response.redirect(
          routes.SUCCESS_OR_ERROR_PAGE({
            success: 'Le gestionnaire de réseau du projet a bien été modifié',
            redirectUrl: routes.GET_LISTE_DOSSIERS_RACCORDEMENT(projetId),
            redirectTitle: 'Retourner sur la page raccordement',
          }),
        );
      } catch (error) {
        if (error instanceof GestionnaireNonRéférencéError) {
          return response.redirect(
            addQueryParams(routes.GET_MODIFIER_GESTIONNAIRE_RESEAU_PROJET_PAGE(projetId), {
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
