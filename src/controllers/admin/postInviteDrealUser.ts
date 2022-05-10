import { createUser, eventStore } from '@config'
import { REGIONS } from '@entities'
import asyncHandler from '../helpers/asyncHandler'
import { addQueryParams } from '../../helpers/addQueryParams'
import { DrealUserInvited } from '@modules/authZ'
import routes from '../../routes'
import { ensureRole } from '@config'
import { v1Router } from '../v1Router'
import * as yup from 'yup'
import { errorResponse, RequestValidationError, validateRequestBody } from '../helpers'
import { logger } from '@core/utils'

const requestBodySchema = yup.object({
  role: yup
    .mixed()
    .oneOf(['dreal'])
    .required('Ce champ est obligatoire')
    .typeError(`Le rôle n'est pas valide`),
  email: yup.string().email("L'email saisi est invalide").required('Ce champ est obligatoire'),
  region: yup
    .mixed()
    .oneOf([...REGIONS])
    .required('Ce champ est obligatoire')
    .typeError("La région saisie n'est pas valide"),
})

v1Router.post(
  routes.ADMIN_INVITE_DREAL_USER_ACTION,
  ensureRole('admin'),
  asyncHandler(async (request, response) => {
    validateRequestBody(request.body, requestBodySchema)
      .asyncAndThen((body) => {
        const { email, role, region } = body

        return createUser({
          email: email.toLowerCase(),
          role,
          createdBy: request.user,
        }).andThen(({ id: userId }) => {
          return eventStore
            .publish(
              new DrealUserInvited({
                payload: {
                  userId,
                  region,
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
            addQueryParams(routes.ADMIN_DREAL_LIST, {
              success: `Une invitation a bien été envoyée à ${email}`,
            })
          ),
        (error: Error) => {
          if (error instanceof RequestValidationError) {
            return response.redirect(
              addQueryParams(routes.ADMIN_DREAL_LIST, {
                ...request.body,
                ...error.errors,
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
