import {
  DomainUseCase,
  PermissionModifierGestionnaireRéseauProjet,
  convertirEnIdentifiantGestionnaireRéseau,
  convertirEnIdentifiantProjet,
  estUnRawIdentifiantProjet,
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
import { mediator } from 'mediateur';
import { NotFoundError } from '@potentiel/core-domain';
import { isSome } from '@potentiel/monads';

const schema = yup.object({
  params: yup.object({ identifiantProjet: yup.string().required() }),
  body: yup.object({
    identifiantGestionnaireRéseau: yup.string().required(),
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
        params: { identifiantProjet },
        body: { identifiantGestionnaireRéseau },
      } = request;

      if (!estUnRawIdentifiantProjet(identifiantProjet)) {
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
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

      try {
        await mediator.send<DomainUseCase>({
          type: 'MODIFIER_GESTIONNAIRE_RESEAU_PROJET_USE_CASE',
          data: {
            identifiantProjet: identifiantProjetValueType,
            identifiantGestionnaireRéseau: convertirEnIdentifiantGestionnaireRéseau(
              identifiantGestionnaireRéseau,
            ),
          },
        });

        return response.redirect(
          routes.SUCCESS_OR_ERROR_PAGE({
            success: 'Le gestionnaire de réseau du projet a bien été modifié',
            redirectUrl: routes.GET_LISTE_DOSSIERS_RACCORDEMENT(identifiantProjet),
            redirectTitle: 'Retourner sur la page raccordement',
          }),
        );
      } catch (error) {
        if (error instanceof NotFoundError) {
          return response.redirect(
            addQueryParams(routes.GET_MODIFIER_GESTIONNAIRE_RESEAU_PROJET_PAGE(identifiantProjet), {
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
