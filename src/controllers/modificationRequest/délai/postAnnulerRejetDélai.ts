import { annulerRejetDélai, ensureRole } from '../../../config';
import { logger } from '../../../core/utils';
import { getModificationRequestAuthority } from '../../../infra/sequelize/queries';
import { EntityNotFoundError, UnauthorizedError } from '../../../modules/shared';
import { validateUniqueId } from '../../../helpers/validateUniqueId';
import routes from '@potentiel/routes';
import { errorResponse, notFoundResponse, unauthorizedResponse } from '../../helpers';
import asyncHandler from '../../helpers/asyncHandler';
import { v1Router } from '../../v1Router';

v1Router.post(
  routes.ADMIN_ANNULER_DELAI_REJETE(),
  ensureRole(['admin', 'dgec-validateur', 'dreal']),
  asyncHandler(async (request, response) => {
    const { modificationRequestId } = request.body as any;
    const { user } = request;

    if (!validateUniqueId(modificationRequestId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Demande' });
    }

    if (user.role === 'dreal') {
      const authority = await getModificationRequestAuthority(modificationRequestId);

      if (authority && authority !== user.role) {
        return unauthorizedResponse({ request, response });
      }
    }

    return annulerRejetDélai({
      user,
      demandeDélaiId: modificationRequestId,
    }).match(
      () => {
        return response.redirect(
          routes.SUCCESS_OR_ERROR_PAGE({
            success: 'La réponse à la demande de délai a bien été annulée.',
            redirectUrl: routes.DEMANDE_PAGE_DETAILS(modificationRequestId),
            redirectTitle: 'Retourner à la demande',
          }),
        );
      },
      (e) => {
        if (e instanceof EntityNotFoundError) {
          return notFoundResponse({ request, response, ressourceTitle: 'Demande' });
        } else if (e instanceof UnauthorizedError) {
          return unauthorizedResponse({ request, response });
        }

        logger.error(e);

        return errorResponse({ request, response });
      },
    );
  }),
);
