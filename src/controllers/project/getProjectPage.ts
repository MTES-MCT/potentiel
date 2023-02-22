import { userIs } from '@modules/users';
import { okAsync } from '@core/utils';
import { getProjectEvents } from '@config';
import { getProjectDataForProjectPage } from '@config/queries.config';
import { shouldUserAccessProject } from '@config/useCases.config';
import { EntityNotFoundError } from '@modules/shared';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import { ProjectDetailsPage } from '@views';
import {
  notFoundResponse,
  errorResponse,
  unauthorizedResponse,
  miseAJourStatistiquesUtilisation,
  vérifierPermissionUtilisateur,
} from '../helpers';
import routes from '@routes';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { PermissionConsulterProjet } from '@modules/project';

const schema = yup.object({
  params: yup.object({ projectId: yup.string().uuid().required() }),
});

v1Router.get(
  routes.PROJECT_DETAILS(),
  vérifierPermissionUtilisateur(PermissionConsulterProjet),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response }) =>
        notFoundResponse({ request, response, ressourceTitle: 'Projet' }),
    },
    async (request, response) => {
      const { projectId } = request.params;
      const { user } = request;

      const userHasRightsToProject = await shouldUserAccessProject.check({
        user,
        projectId,
      });

      if (!userHasRightsToProject) {
        return unauthorizedResponse({
          request,
          response,
          customMessage: `Votre compte ne vous permet pas d'à accéder à ce projet.`,
        });
      }

      await getProjectDataForProjectPage({ projectId, user })
        .andThen((project) => {
          if (userIs('ademe')(user)) {
            return okAsync({ project, projectEventList: undefined });
          }
          return getProjectEvents({ projectId, user }).map((projectEventList) => ({
            project,
            projectEventList,
          }));
        })
        .match(
          ({ project, projectEventList }) => {
            miseAJourStatistiquesUtilisation({
              type: 'projetConsulté',
              données: {
                utilisateur: { role: request.user.role },
                projet: {
                  appelOffreId: project.appelOffreId,
                  periodeId: project.periodeId,
                  ...(project.familleId && { familleId: project.familleId }),
                  numéroCRE: project.numeroCRE,
                },
              },
            });

            return response.send(
              ProjectDetailsPage({
                request,
                project,
                projectEventList,
                now: new Date().getTime(),
              }),
            );
          },
          (e) => {
            if (e instanceof EntityNotFoundError) {
              return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
            }

            return errorResponse({ request, response });
          },
        );
    },
  ),
);
