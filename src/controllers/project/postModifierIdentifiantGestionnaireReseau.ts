import { renseignerIdentifiantGestionnaireRéseau } from '@config'
import { logger } from '@core/utils'
import {
  IdentifiantGestionnaireRéseauExistantError,
  IdentifiantGestionnaireRéseauObligatoireError,
  PermissionModifierIdentifiantGestionnaireReseau,
} from '@modules/project'
import routes from '@routes'
import { object, string } from 'yup'
import { errorResponse, vérifierPermissionUtilisateur } from '../helpers'
import safeAsyncHandler from '../helpers/safeAsyncHandler'
import { v1Router } from '../v1Router'

const schema = object({
  body: object({
    projetId: string().uuid().required(),
    identifiantGestionnaireRéseau: string().required("L'identifiant est obligatoire"),
  }),
})

v1Router.post(
  routes.POST_MODIFIER_IDENTIFIANT_GESTIONNAIRE_RESEAU,
  vérifierPermissionUtilisateur(PermissionModifierIdentifiantGestionnaireReseau),
  safeAsyncHandler(
    {
      schema,
      onError({ request, response }) {
        errorResponse({
          request,
          response,
          customMessage: `L'identifiant de gestionnaire de réseau est obligatoire.`,
        })
      },
    },
    async (request, response) => {
      const {
        body: { projetId, identifiantGestionnaireRéseau },
        user,
      } = request

      return renseignerIdentifiantGestionnaireRéseau({
        projetId,
        utilisateur: user,
        identifiantGestionnaireRéseau,
      }).match(
        () =>
          response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success:
                "Le changement d'identifiant de gestionnaire de réseau a bien été pris en compte",
              redirectUrl: routes.PROJECT_DETAILS(projetId),
              redirectTitle: 'Retourner sur la page du projet',
            })
          ),
        (error) => {
          if (
            error instanceof IdentifiantGestionnaireRéseauExistantError ||
            error instanceof IdentifiantGestionnaireRéseauObligatoireError
          ) {
            return errorResponse({
              request,
              response,
              customMessage: error.message,
            })
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
    }
  )
)
