import { createUser, eventStore } from '@config'
import asyncHandler from '../../helpers/asyncHandler'
import { addQueryParams } from '../../../helpers/addQueryParams'
import { PartnerUserInvited } from '@modules/authZ'
import routes from '../../../routes'
import { ensureRole } from '@config'
import { v1Router } from '../../v1Router'
import * as yup from 'yup'
import { errorResponse, RequestValidationError, validateRequestBody } from '../../helpers'
import { logger } from '@core/utils'
import { EmailAlreadyUsedError } from '../../../modules/shared/errors'

const requestBodySchema = yup.object({
  role: yup
    .mixed<'acheteur-obligé' | 'ademe'>()
    .oneOf(['acheteur-obligé', 'ademe'])
    .required('Ce champ est obligatoire')
    .typeError(`Le rôle n'est pas valide`),
  email: yup.string().email("L'email saisi est invalide").required('Ce champ est obligatoire'),
})

v1Router.post(
  routes.ADMIN_INVITE_USER_ACTION,
  ensureRole('admin'),
  asyncHandler(async (request, response) => {
    validateRequestBody(request.body, requestBodySchema)
      .asyncAndThen((body) => {
        const { email, role } = body

        return createUser({
          email: email.toLowerCase(),
          role,
          createdBy: request.user,
        }).andThen(({ id: userId }) => {
          return eventStore
            .publish(
              new PartnerUserInvited({
                payload: {
                  userId,
                  role,
                  invitedBy: request.user.id,
                },
              })
            )
            .map(() => ({ email }))
        })
      })
      .match(
        ({ email }) =>
          response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success: `Une invitation a bien été envoyée à ${email}.`,
              redirectUrl: routes.ADMIN_PARTNER_USERS,
              redirectTitle: 'Retourner à la liste des utilisateurs partenaires',
            })
          ),
        (error: Error) => {
          if (error instanceof RequestValidationError) {
            return response.redirect(
              addQueryParams(routes.ADMIN_PARTNER_USERS, {
                ...request.body,
                ...error.errors,
              })
            )
          }
          if (error instanceof EmailAlreadyUsedError) {
            return response.redirect(
              addQueryParams(routes.ADMIN_PARTNER_USERS, {
                ...request.body,
                error:
                  "L'invitation n'a pas pu être envoyée car l'adresse email est déjà associée à un compte Potentiel.",
              })
            )
          }
          logger.error(error)
          return errorResponse({
            request,
            response,
            customMessage:
              'Il y a eu une erreur lors de la soumission de votre demande. Merci de recommencer.',
          })
        }
      )
  })
)
