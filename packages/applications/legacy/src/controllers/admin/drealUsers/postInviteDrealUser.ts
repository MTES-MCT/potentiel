import { createUser, eventStore, ensureRole } from '../../../config';
import { addQueryParams } from '../../../helpers/addQueryParams';
import { DrealUserInvited } from '../../../modules/authZ';
import routes from '../../../routes';
import { v1Router } from '../../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../../helpers/safeAsyncHandler';
import { errorResponse, RequestValidationError } from '../../helpers';
import { EmailAlreadyUsedError } from '../../../modules/shared/errors';
import { logger } from '../../../core/utils';
import { REGIONS } from '../../../modules/dreal/région';

const schema = yup.object({
  body: yup.object({
    role: yup
      .mixed()
      .oneOf(['dreal'])
      .required('Ce champ est obligatoire')
      .typeError(`Le rôle n'est pas valide`),
    email: yup
      .string()
      .email("L'email saisi est invalide")
      .required("L'email est un champ obligatoire"),
    region: yup
      .mixed()
      .oneOf([...REGIONS], 'Vous devez sélectionner une région dans le menu déroulant ci-dessous')
      .required('La région est un champ obligatoire')
      .typeError("La région saisie n'est pas valide"),
  }),
});

v1Router.post(
  routes.ADMIN_INVITE_DREAL_USER_ACTION,
  ensureRole(['admin', 'dgec-validateur']),
  safeAsyncHandler(
    {
      schema,
      onError: ({ response, request, error }) =>
        response.redirect(
          addQueryParams(routes.ADMIN_DREAL_LIST, {
            ...request.params,
            error: `${error.errors.join(' ')}`,
          }),
        ),
    },
    async (request, response) => {
      const { email, role, region } = request.body;

      return createUser({
        email: email.toLowerCase(),
        role,
        createdBy: request.user,
      })
        .andThen(({ id: userId }) => {
          return eventStore
            .publish(
              new DrealUserInvited({
                payload: {
                  userId,
                  region,
                  invitedBy: request.user.id,
                },
              }),
            )
            .map(() => ({ email }));
        })
        .match(
          ({ email }) =>
            response.redirect(
              addQueryParams(routes.ADMIN_DREAL_LIST, {
                ...request.params,
                success: `Une invitation a bien été envoyée à ${email}.`,
              }),
            ),
          (error: Error) => {
            if (error instanceof RequestValidationError) {
              return response.redirect(
                addQueryParams(routes.ADMIN_DREAL_LIST, {
                  ...request.body,
                  ...error.errors,
                }),
              );
            }
            if (error instanceof EmailAlreadyUsedError) {
              return response.redirect(
                addQueryParams(routes.ADMIN_DREAL_LIST, {
                  ...request.body,
                  error:
                    "L'invitation n'a pas pu être envoyée car l'adresse email est déjà associée à un compte Potentiel.",
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
