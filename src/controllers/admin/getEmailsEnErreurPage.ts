import { getFailedNotificationDetails, ensureRole } from '@config';
import { logger } from '@core/utils';
import asyncHandler from '../helpers/asyncHandler';
import { makePagination } from '../../helpers/paginate';
import routes from '@routes';
import { Pagination } from '../../types';
import { v1Router } from '../v1Router';
import { EmailsEnErreurPage } from '@views';

const defaultPagination: Pagination = {
  page: 0,
  pageSize: 50,
};

v1Router.get(
  routes.ADMIN_NOTIFICATION_LIST,
  ensureRole(['admin', 'dgec-validateur']),
  asyncHandler(async (request, response) => {
    const pagination = makePagination(request.query, defaultPagination);

    return await getFailedNotificationDetails(pagination).match(
      (notifications) =>
        response.send(
          EmailsEnErreurPage({
            request,
            notifications,
          }),
        ),
      (e) => {
        logger.error(e);
        return response
          .status(500)
          .send('Impossible de charger la liste des notifications en erreur.');
      },
    );
  }),
);
