import { getFailedNotificationDetails, ensureRole } from '../../config';
import { logger } from '../../core/utils';
import asyncHandler from '../helpers/asyncHandler';
import { v1Router } from '../v1Router';
import { EmailsEnErreurPage } from '../../views';
import { getCurrentUrl, getPagination } from '../helpers';
import { GET_LISTE_EMAILS_EN_ERREUR } from '@potentiel/legacy-routes';

v1Router.get(
  GET_LISTE_EMAILS_EN_ERREUR,
  ensureRole(['admin', 'dgec-validateur']),
  asyncHandler(async (request, response) => {
    const pagination = getPagination(request);

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
