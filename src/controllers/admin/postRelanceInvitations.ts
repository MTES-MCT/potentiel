import { relanceInvitation, ensureRole } from '../../config';
import asyncHandler from '../helpers/asyncHandler';
import { addQueryParams } from '../../helpers/addQueryParams';
import routes from '../../routes';
import { v1Router } from '../v1Router';
import { GET_LISTE_CANDIDATS_EN_ATTENTE } from '@potentiel/legacy-routes';

v1Router.post(
  routes.ADMIN_INVITATION_RELANCE_ACTION,
  ensureRole(['admin', 'dgec-validateur']),
  asyncHandler(async (request, response) => {
    const { email } = request.body;

    const redirectTo = GET_LISTE_CANDIDATS_EN_ATTENTE;

    await relanceInvitation({ email, relanceBy: request.user }).match(
      () => {
        return response.redirect(
          addQueryParams(redirectTo, {
            success: `Une invitation a bien été renvoyée à ${email}.`,
          }),
        );
      },
      (e) => {
        return response.redirect(
          addQueryParams(redirectTo, {
            error:
              "L'invitation n'a pas pu être relancée pour une raison technique. Merci de réessayer.",
          }),
        );
      },
    );
  }),
);
