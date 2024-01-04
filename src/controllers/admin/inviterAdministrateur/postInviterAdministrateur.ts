import * as yup from 'yup';
import { v1Router } from '../../v1Router';
import {
  RequestValidationError,
  errorResponse,
  vérifierPermissionUtilisateur,
} from '../../helpers';
import { inviterUtilisateur } from '../../../config';
import {
  InvitationUniqueParUtilisateurError,
  InvitationUtilisateurExistantError,
  PermissionInviterAdministrateur,
} from '../../../modules/utilisateur';
import { logger } from '../../../core/utils';
import { addQueryParams } from '../../../helpers/addQueryParams';
import safeAsyncHandler from '../../helpers/safeAsyncHandler';

import { GET_INVITER_ADMINISTRATEUR, POST_INVITER_ADMINISTRATEUR } from '@potentiel/legacy-routes';

const schema = yup.object({
  body: yup.object({
    email: yup.string().email("L'email saisi est invalide").required('Ce champ est obligatoire'),
  }),
});

v1Router.post(
  POST_INVITER_ADMINISTRATEUR,
  vérifierPermissionUtilisateur(PermissionInviterAdministrateur),
  safeAsyncHandler(
    {
      schema,
      onError: ({ response, request, error }) =>
        response.redirect(
          addQueryParams(GET_INVITER_ADMINISTRATEUR, {
            ...request.params,
            error: `${error.errors.join(' ')}`,
          }),
        ),
    },
    async (request, response) => {
      const { email } = request.body;
      inviterUtilisateur({ email, role: 'admin', invitéPar: request.user })
        .map(() => ({
          email,
        }))
        .match(
          ({ email }) =>
            response.redirect(
              addQueryParams(GET_INVITER_ADMINISTRATEUR, {
                ...request.params,
                success: `Une invitation a bien été envoyée à ${email}.`,
              }),
            ),

          (error: Error) => {
            if (error instanceof RequestValidationError) {
              return response.redirect(
                addQueryParams(GET_INVITER_ADMINISTRATEUR, {
                  ...request.body,
                  ...error.errors,
                }),
              );
            }
            if (
              error instanceof InvitationUniqueParUtilisateurError ||
              error instanceof InvitationUtilisateurExistantError
            ) {
              return response.redirect(
                addQueryParams(GET_INVITER_ADMINISTRATEUR, {
                  ...request.body,
                  error: error.message,
                }),
              );
            }
            logger.error(error);
            return errorResponse({
              request,
              response,
              customMessage:
                'Il y a eu une erreur lors de la soumission de votre demande. Merci de recommencer.',
            });
          },
        );
    },
  ),
);
