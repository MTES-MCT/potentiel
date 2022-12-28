import routes from '@routes'
import * as yup from 'yup'
import { v1Router } from '../../v1Router'
import { addQueryParams } from '../../../helpers/addQueryParams'
import {
  errorResponse,
  RequestValidationError,
  validateRequestBody,
  vérifierPermissionUtilisateur,
} from '../../helpers'
import { inviterUtilisateur } from '@config'
import { InvitationUniqueParUtilisateurError } from '@modules/utilisateur'
import { logger } from '@core/utils'
import asyncHandler from '../../helpers/asyncHandler'
import { PermissionInviterDgecValidateur } from '@modules/inviterDgecValidateur/permissions'

const schema = yup.object({
  role: yup
    .mixed<'dgec-validateur'>()
    .oneOf(['dgec-validateur'])
    .required('Ce champ est obligatoire')
    .typeError(`Le rôle n'est pas valide`),
  email: yup.string().email("L'email saisi est invalide").required('Ce champ est obligatoire'),
})

v1Router.post(
  routes.ADMIN_INVITATION_DGEC_VALIDATEUR_ACTION,
  vérifierPermissionUtilisateur(PermissionInviterDgecValidateur),
  asyncHandler(async (request, response) => {
    validateRequestBody(request.body, schema)
      .asyncAndThen(({ email, role }) => inviterUtilisateur({ email, role }).map(() => ({ email })))
      .match(
        ({ email }) =>
          response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success: `Une invitation a bien été envoyée à ${email}.`,
              redirectUrl: routes.ADMIN_INVITATION_DGEC_VALIDATEUR,
              redirectTitle: "Retourner à la page d'ajout de DGEC validateur",
            })
          ),
        (error: Error) => {
          if (error instanceof RequestValidationError) {
            return response.redirect(
              addQueryParams(routes.ADMIN_INVITATION_DGEC_VALIDATEUR, {
                ...request.body,
                ...error.errors,
              })
            )
          }
          if (error instanceof InvitationUniqueParUtilisateurError) {
            return response.redirect(
              addQueryParams(routes.ADMIN_INVITATION_DGEC_VALIDATEUR, {
                ...request.body,
                error: error.message,
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
