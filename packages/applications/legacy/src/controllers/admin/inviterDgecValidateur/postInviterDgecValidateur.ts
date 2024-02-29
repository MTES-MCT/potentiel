import routes from '../../../routes';
import * as yup from 'yup';
import { v1Router } from '../../v1Router';
import {
  RequestValidationError,
  validateRequestBody,
  vérifierPermissionUtilisateur,
} from '../../helpers';
import { inviterUtilisateur } from '../../../config';
import {
  InvitationUniqueParUtilisateurError,
  InvitationUtilisateurExistantError,
  PermissionInviterDgecValidateur,
} from '../../../modules/utilisateur';
import { logger } from '../../../core/utils';
import asyncHandler from '../../helpers/asyncHandler';
import { setApiResult } from '../../helpers/apiResult';

const schema = yup.object({
  role: yup
    .mixed<'dgec-validateur'>()
    .oneOf(['dgec-validateur'])
    .required('Ce champ est obligatoire')
    .typeError(`Le rôle n'est pas valide`),
  email: yup.string().email("L'email saisi est invalide").required('Ce champ est obligatoire'),
  fonction: yup
    .string()
    .required('Ce champ est obligatoire')
    .typeError("La fonction renseignée n'est pas valide"),
});

v1Router.post(
  routes.ADMIN_INVITATION_DGEC_VALIDATEUR_ACTION,
  vérifierPermissionUtilisateur(PermissionInviterDgecValidateur),
  asyncHandler(async (request, response) => {
    validateRequestBody(request.body, schema)
      .asyncAndThen(({ email, role, fonction }) =>
        inviterUtilisateur({ email, role, invitéPar: request.user, fonction }).map(() => ({
          email,
        })),
      )
      .match(
        () => {
          setApiResult(request, {
            route: routes.ADMIN_INVITATION_DGEC_VALIDATEUR_ACTION,
            status: 'OK',
          });
          return response.redirect(routes.ADMIN_INVITATION_DGEC_VALIDATEUR);
        },
        (error: Error) => {
          if (error instanceof RequestValidationError) {
            setApiResult(request, {
              route: routes.ADMIN_INVITATION_DGEC_VALIDATEUR_ACTION,
              status: 'BAD_REQUEST',
              message: 'Le formulaire contient des erreurs',
              formErrors: Object.entries(error.errors).reduce((prev, [key, value]) => {
                return {
                  ...prev,
                  [key.replace('error-', '')]: value,
                };
              }, {}),
            });
            return response.redirect(routes.ADMIN_INVITATION_DGEC_VALIDATEUR);
          }
          if (
            error instanceof InvitationUniqueParUtilisateurError ||
            error instanceof InvitationUtilisateurExistantError
          ) {
            setApiResult(request, {
              route: routes.ADMIN_INVITATION_DGEC_VALIDATEUR_ACTION,
              status: 'BAD_REQUEST',
              message: error.message,
            });
            return response.redirect(routes.ADMIN_INVITATION_DGEC_VALIDATEUR);
          }
          logger.error(error);
          setApiResult(request, {
            route: routes.ADMIN_INVITATION_DGEC_VALIDATEUR_ACTION,
            status: 'BAD_REQUEST',
            message:
              'Il y a eu une erreur lors de la soumission de votre demande. Merci de recommencer.',
          });
          return response.redirect(routes.ADMIN_INVITATION_DGEC_VALIDATEUR);
        },
      );
  }),
);
