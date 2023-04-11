import { ensureRole } from '@config';
import asyncHandler from '../helpers/asyncHandler';
import { getProjectDataForSignalerDemandeRecoursPage } from '@config/queries.config';
import { shouldUserAccessProject } from '@config/useCases.config';
import { validateUniqueId } from '../../helpers/validateUniqueId';
import { EntityNotFoundError } from '@modules/shared';
import routes from '@routes';
import { errorResponse, notFoundResponse, unauthorizedResponse } from '../helpers';
import { v1Router } from '../v1Router';
import { SignalerDemandeRecoursPage } from '@views';

v1Router.get(
  routes.ADMIN_SIGNALER_DEMANDE_RECOURS_GET(),
  ensureRole(['admin', 'dgec-validateur', 'dreal']),
  asyncHandler(async (request, response) => {
    const { projectId } = request.params;
    const { user, query } = request;

    if (!validateUniqueId(projectId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
    }

    const userHasRightsToProject = await shouldUserAccessProject.check({
      user,
      projectId,
    });

    if (!userHasRightsToProject) {
      return unauthorizedResponse({
        request,
        response,
        customMessage: `Votre compte ne vous permet pas d'accéder à cette page.`,
      });
    }

    const validationErrors: Array<{ [fieldName: string]: string }> = Object.entries(query).reduce(
      (errors, [key, value]) => ({
        ...errors,
        ...(key.startsWith('error-') && { [key.replace('error-', '')]: value }),
      }),
      [] as Array<{ [fieldName: string]: string }>,
    );

    await getProjectDataForSignalerDemandeRecoursPage({ projectId }).match(
      (project) => {
        return response.send(
          SignalerDemandeRecoursPage({
            request,
            project,
            validationErrors,
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
  }),
);
