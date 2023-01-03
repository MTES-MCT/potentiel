import routes from '@routes'
import * as yup from 'yup'
import { v1Router } from '../../v1Router'
import {
  RequestValidationError,
  validateRequestBody,
  vérifierPermissionUtilisateur,
} from '../../helpers'
import { inviterUtilisateur } from '@config'
import {
  InvitationUniqueParUtilisateurError,
  PermissionInviterDgecValidateur,
} from '@modules/utilisateur'
import { logger } from '@core/utils'
import asyncHandler from '../../helpers/asyncHandler'
import { sauvegarderRésultatFormulaire } from '../../helpers/formulaires'

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
})

v1Router.post(
  routes.ADMIN_INVITATION_DGEC_VALIDATEUR_ACTION,
  vérifierPermissionUtilisateur(PermissionInviterDgecValidateur),
  asyncHandler(async (request, response) => {
    validateRequestBody(request.body, schema)
      .asyncAndThen(({ email, role, fonction }) =>
        inviterUtilisateur({ email, role, invitéPar: request.user, fonction }).map(() => ({
          email,
        }))
      )
      .match(
        () => {
          sauvegarderRésultatFormulaire(request, routes.ADMIN_INVITATION_DGEC_VALIDATEUR_ACTION, {
            type: 'succès',
            message: "L'invitation a bien été envoyée",
          })
          return response.redirect(routes.ADMIN_INVITATION_DGEC_VALIDATEUR)
        },
        (error: Error) => {
          if (error instanceof RequestValidationError) {
            sauvegarderRésultatFormulaire(request, routes.ADMIN_INVITATION_DGEC_VALIDATEUR_ACTION, {
              type: 'échec',
              raison: 'Le formulaire contient des erreurs',
              erreursDeValidation: Object.entries(error.errors).reduce((prev, [key, value]) => {
                return {
                  ...prev,
                  [key.replace('error-', '')]: value,
                }
              }, {}),
            })
            return response.redirect(routes.ADMIN_INVITATION_DGEC_VALIDATEUR)
          }
          if (error instanceof InvitationUniqueParUtilisateurError) {
            sauvegarderRésultatFormulaire(request, routes.ADMIN_INVITATION_DGEC_VALIDATEUR_ACTION, {
              type: 'échec',
              raison: error.message,
            })
            return response.redirect(routes.ADMIN_INVITATION_DGEC_VALIDATEUR)
          }
          logger.error(error)
          sauvegarderRésultatFormulaire(request, routes.ADMIN_INVITATION_DGEC_VALIDATEUR_ACTION, {
            type: 'échec',
            raison:
              'Il y a eu une erreur lors de la soumission de votre demande. Merci de recommencer.',
          })
          return response.redirect(routes.ADMIN_INVITATION_DGEC_VALIDATEUR)
        }
      )
  })
)
