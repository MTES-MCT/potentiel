import { ensureRole, getModificationRequestDetails } from '../../../config';
import { logger } from '../../../core/utils';
import { EntityNotFoundError } from '../../../modules/shared';
import { DetailsDemandeDelaiPage } from '../../../views';
import routes from '../../../routes';
import { shouldUserAccessProject } from '../../../config/useCases.config';
import { getModificationRequestAuthority } from '../../../infra/sequelize/queries';
import { errorResponse, notFoundResponse, unauthorizedResponse } from '../../helpers';
import asyncHandler from '../../helpers/asyncHandler';
import { v1Router } from '../../v1Router';
import { validateUniqueId } from '../../../helpers/validateUniqueId';
import { ModificationRequest } from '../../../infra/sequelize/projectionsNext';

v1Router.get(
  routes.GET_DETAILS_DEMANDE_DELAI_PAGE(),
  ensureRole(['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé', 'cre']),
  asyncHandler(async (request, response) => {
    const { user } = request;
    const { demandeDelaiId } = request.params;

    if (!validateUniqueId(demandeDelaiId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Demande' });
    }

    const projectId = await _getProjectId(demandeDelaiId);
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

    const authority = await getModificationRequestAuthority(demandeDelaiId);

    if (user?.role === 'dreal' && authority !== 'dreal') {
      return unauthorizedResponse({ request, response });
    }

    const modificationRequestResult = await getModificationRequestDetails(demandeDelaiId);

    return modificationRequestResult.match(
      (modificationRequest) => {
        if (modificationRequest.type !== 'delai') {
          return notFoundResponse({ request, response, ressourceTitle: 'Demande' });
        }
        return response.send(DetailsDemandeDelaiPage({ request, modificationRequest }));
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
