import { getModificationRequestListForPorteur } from '../../config/queries.config';
import { logger } from '../../core/utils';
import { appelOffreRepo } from '../../dataAccess/inMemory';
import asyncHandler from '../helpers/asyncHandler';
import routes from '../../routes';
import { ModificationRequestListPage } from '../../views';
import { ensureRole } from '../../config';
import { v1Router } from '../v1Router';
import { getCurrentUrl } from '../helpers';
import { getPagination } from '../helpers/getPagination';

v1Router.get(
  routes.USER_LIST_REQUESTS,
  ensureRole(['porteur-projet']),
  asyncHandler(async (request, response) => {
    const { user, query } = request;

    const {
      appelOffreId,
      periodeId,
      familleId,
      recherche,
      modificationRequestStatus,
      modificationRequestType,
    } = query as any;

    const pagination = getPagination(request);
    const appelsOffre = await appelOffreRepo.findAll();

    return await getModificationRequestListForPorteur({
      user,
      pagination,
      appelOffreId,
      ...(appelOffreId && { periodeId }),
      ...(appelOffreId && { familleId }),
      recherche,
      modificationRequestStatus,
      modificationRequestType,
    }).match(
      (modificationRequests) =>
        response.send(
          ModificationRequestListPage({
            request,
            modificationRequests,
            appelsOffre,
            currentUrl: getCurrentUrl(request),
          }),
        ),
      (e) => {
        logger.error(e);
        return response
          .status(500)
          .send('Impossible de charger la liste des demandes. Merci de réessayer plus tard.');
      },
    );
  }),
);
