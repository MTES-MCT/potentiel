import { renseignerIdentifiantGestionnaireRéseau } from '@config'
import { logger } from '@core/utils'
import {
  IdentifiantGestionnaireRéseauExistantError,
  IdentifiantGestionnaireRéseauObligatoireError,
  PermissionModifierIdentifiantGestionnaireReseau,
} from '@modules/project'
import routes from '@routes'
import { addQueryParams } from 'src/helpers/addQueryParams'
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
      onError: ({ request, response, error }) =>
        response.redirect(
          addQueryParams(
            routes.GET_MODIFIER_IDENTIFIANT_GESTIONNAIRE_RESEAU(request.body.projetId),
            {
              error: error.errors.join(''),
            }
          )
        ),
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
            addQueryParams(
              routes.GET_MODIFIER_IDENTIFIANT_GESTIONNAIRE_RESEAU(request.body.projetId),
              {
                success:
                  "Le changement d'identifiant de gestionnaire de réseau a bien été pris en compte",
              }
            )
          ),
        (error) => {
          if (
            error instanceof IdentifiantGestionnaireRéseauExistantError ||
            error instanceof IdentifiantGestionnaireRéseauObligatoireError
          ) {
            return addQueryParams(routes.GET_MODIFIER_IDENTIFIANT_GESTIONNAIRE_RESEAU(projetId), {
              error,
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
