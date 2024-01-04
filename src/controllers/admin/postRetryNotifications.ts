import { retryFailedNotifications, ensureRole } from '../../config';
import asyncHandler from '../helpers/asyncHandler';
import routes from '../../routes';
import { v1Router } from '../v1Router';
import { GET_LISTE_EMAILS_EN_ERREUR } from '@potentiel/legacy-routes';

v1Router.post(
  routes.ADMIN_NOTIFICATION_RETRY_ACTION,
  ensureRole(['admin', 'dgec-validateur']),
  asyncHandler(async (request, response) => {
    const notificationsRetried = await retryFailedNotifications();

    return response.redirect(
      routes.SUCCESS_OR_ERROR_PAGE({
        success: notificationsRetried
          ? `${notificationsRetried} notifications ont été renvoyées`
          : `Aucun notification n'a été renvoyée. Merci de vérifier qu'il y a bien des notifications en erreur.`,
        redirectUrl: GET_LISTE_EMAILS_EN_ERREUR,
        redirectTitle: 'Retourner à la page des emails',
      }),
    );
  }),
);
