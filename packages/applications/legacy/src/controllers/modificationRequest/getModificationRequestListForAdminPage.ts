import { getModificationRequestListForAdmin } from '../../config/queries.config';
import { logger } from '../../core/utils';
import { appelOffreRepo } from '../../dataAccess/inMemory';
import asyncHandler from '../helpers/asyncHandler';
import routes from '../../routes';
import { ModificationRequestListPage } from '../../views';
import { v1Router } from '../v1Router';
import { userIs } from '../../modules/users';
import { getCurrentUrl, getPagination, vérifierPermissionUtilisateur } from '../helpers';
import { PermissionListerDemandesAdmin } from '../../modules/modificationRequest/queries';

v1Router.get(
  routes.ADMIN_LIST_REQUESTS,
  vérifierPermissionUtilisateur(PermissionListerDemandesAdmin),
  asyncHandler(async (request, response) => {
    const { user, query } = request;

    const {
      appelOffreId,
      periodeId,
      familleId,
      recherche,
      modificationRequestStatus,
      modificationRequestType,
      showOnlyDGEC = 'on',
    } = query as any;

    const pagination = getPagination(request);
    const appelsOffre = await appelOffreRepo.findAll();

    return await getModificationRequestListForAdmin({
      user,
      pagination,
      appelOffreId,
      ...(appelOffreId && { periodeId }),
      ...(appelOffreId && { familleId }),
      recherche,
      modificationRequestStatus,
      modificationRequestType,
      ...(userIs(['admin', 'dgec-validateur'])(user) &&
        showOnlyDGEC !== 'on' && { forceNoAuthority: true }),
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
