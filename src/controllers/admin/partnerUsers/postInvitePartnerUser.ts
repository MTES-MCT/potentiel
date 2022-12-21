import { ensureRole, inviterUtilisateur } from '@config'
import asyncHandler from '../../helpers/asyncHandler'
import { addQueryParams } from '../../../helpers/addQueryParams'
import routes from '@routes'
import { v1Router } from '../../v1Router'
import * as yup from 'yup'
import { errorResponse, RequestValidationError, validateRequestBody } from '../../helpers'
import { logger } from '@core/utils'
import { InvitationUniqueParUtilisateurError } from '@modules/utilisateur'

const requestBodySchema = yup.object({
  role: yup
    .mixed<'acheteur-obligé' | 'ademe' | 'cre' | 'caisse-des-dépôts'>()
    .oneOf(
      ['acheteur-obligé', 'ademe', 'cre', 'caisse-des-dépôts'],
      'Seules les valeurs suivantes sont acceptées : Acheteur obligé, ADEME, CRE et Caisse des dépôts'
    )
    .required('Ce champ est obligatoire')
    .typeError(`Le rôle n'est pas valide`),
  email: yup.string().email("L'email saisi est invalide").required('Ce champ est obligatoire'),
})

v1Router.post(
  routes.ADMIN_INVITE_USER_ACTION,
  ensureRole(['admin', 'dgec-validateur']),
  asyncHandler(async (request, response) => {
    validateRequestBody(request.body, requestBodySchema)
      .asyncAndThen(({ email, role }) => inviterUtilisateur({ email, role }).map(() => ({ email })))
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
          if (error instanceof InvitationUniqueParUtilisateurError) {
            return response.redirect(
              addQueryParams(routes.ADMIN_PARTNER_USERS, {
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
