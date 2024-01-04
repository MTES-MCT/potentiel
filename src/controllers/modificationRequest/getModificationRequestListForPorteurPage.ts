import { getModificationRequestListForPorteur } from '../../config/queries.config';
import { logger } from '../../core/utils';
import { appelOffreRepo } from '../../dataAccess/inMemory';
import asyncHandler from '../helpers/asyncHandler';
import { ModificationRequestListPage } from '../../views';
import { ensureRole } from '../../config';
import { v1Router } from '../v1Router';
import { getCurrentUrl } from '../helpers';
import { getPagination } from '../helpers/getPagination';
import { GET_LISTE_DEMANDES_PORTEURS } from '@potentiel/legacy-routes';

v1Router.get(
  GET_LISTE_DEMANDES_PORTEURS,
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
