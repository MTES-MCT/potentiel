import { getFailedNotificationDetails, ensureRole } from '@config';
import { logger } from '@core/utils';
import asyncHandler from '../helpers/asyncHandler';
import { makePagination } from '../../helpers/paginate';
import routes from '@routes';
import { v1Router } from '../v1Router';
import { EmailsEnErreurPage } from '@views';
import { getCurrentUrl, getDefaultPagination } from '../helpers';

v1Router.get(
  routes.ADMIN_NOTIFICATION_LIST,
  ensureRole(['admin', 'dgec-validateur']),
  asyncHandler(async (request, response) => {
    const pagination = makePagination(
      request.query,
      getDefaultPagination({ cookies: request.cookies, pageSize: 50 }),
    );

    return await getFailedNotificationDetails(pagination).match(
      (notifications) =>
        response.send(
          EmailsEnErreurPage({
            request,
            notifications,
            currentUrl: getCurrentUrl(request),
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
