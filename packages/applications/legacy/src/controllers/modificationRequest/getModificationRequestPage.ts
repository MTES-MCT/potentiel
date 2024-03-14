import { ensureRole, getModificationRequestDetails } from '../../config';
import { logger } from '../../core/utils';
import { EntityNotFoundError } from '../../modules/shared';
import { ModificationRequestPage } from '../../views';
import routes from '../../routes';
import { shouldUserAccessProject } from '../../config/useCases.config';
import { errorResponse, notFoundResponse, unauthorizedResponse } from '../helpers';
import asyncHandler from '../helpers/asyncHandler';
import { v1Router } from '../v1Router';
import { validateUniqueId } from '../../helpers/validateUniqueId';
import { ModificationRequest } from '../../infra/sequelize/projectionsNext';

v1Router.get(
  routes.DEMANDE_PAGE_DETAILS(),
  ensureRole(['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé', 'cre']),
  asyncHandler(async (request, response) => {
    const { user } = request;

    const { modificationRequestId } = request.params;

    if (!validateUniqueId(modificationRequestId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Demande' });
    }

    const projectId = await _getProjectId(modificationRequestId);
    if (!projectId) {
      return notFoundResponse({ request, response, ressourceTitle: 'Demande' });
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

    const modificationRequestResult = await getModificationRequestDetails(modificationRequestId);

    return modificationRequestResult.match(
      (modificationRequest) => {
        return response.send(ModificationRequestPage({ request, modificationRequest }));
      },
      (e) => {
        if (e instanceof EntityNotFoundError) {
          return notFoundResponse({ request, response, ressourceTitle: 'Demande' });
        }

        logger.error(e);
        return errorResponse({ request, response });
      },
    );
  }),
);

const _getProjectId = async (modificationRequestId) => {
  const rawModificationRequest = await ModificationRequest.findOne({
    where: {
      id: modificationRequestId,
    },
    attributes: ['projectId'],
  });

  return rawModificationRequest?.projectId;
};
