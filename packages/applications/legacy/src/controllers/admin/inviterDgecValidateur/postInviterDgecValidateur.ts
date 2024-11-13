import routes from '../../../routes';
import * as yup from 'yup';
import { v1Router } from '../../v1Router';
import {
  RequestValidationError,
  validateRequestBody,
  vérifierPermissionUtilisateur,
} from '../../helpers';
import { inviterUtilisateur } from '../../../config';
import { PermissionInviterDgecValidateur } from '../../../modules/utilisateur';
import { logger } from '../../../core/utils';
import asyncHandler from '../../helpers/asyncHandler';

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
          return response.redirect(routes.ADMIN_INVITATION_DGEC_VALIDATEUR);
        },
        (error: Error) => {
          if (error instanceof RequestValidationError) {
            return response.redirect(
              routes.ADMIN_INVITATION_DGEC_VALIDATEUR +
                '?' +
                new URLSearchParams({ error: 'Le formulaire contient des erreurs' }).toString(),
            );
          }
          logger.error(error);

          return response.redirect(
            routes.ADMIN_INVITATION_DGEC_VALIDATEUR +
              `?` +
              new URLSearchParams({ error: "Impossible d'inviter l'utilisateur" }).toString(),
          );
        },
      );
  }),
);
