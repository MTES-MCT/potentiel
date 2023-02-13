import { object, string } from 'yup'

import routes from '@routes'
import { v1Router } from '../v1Router'
import { ModifierIdentifiantGestionnaireReseauPage } from '@views'
import { errorResponse, notFoundResponse, vérifierPermissionUtilisateur } from '../helpers'
import { getProjectDataForModifierIdentifiantGestionnaireReseauPage } from '@config'
import safeAsyncHandler from '../helpers/safeAsyncHandler'
import { EntityNotFoundError } from '@modules/shared'
import { PermissionModifierIdentifiantGestionnaireReseau } from '@modules/project'

const schema = object({
  params: object({
    projetId: string().uuid().required(),
  }),
})

v1Router.get(
  routes.GET_MODIFIER_IDENTIFIANT_GESTIONNAIRE_RESEAU(),
  vérifierPermissionUtilisateur(PermissionModifierIdentifiantGestionnaireReseau),
  safeAsyncHandler(
    {
      schema,
      onError({ request, response }) {
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' })
      },
    },
    async (request, response) => {
      const { projetId } = request.params
      await getProjectDataForModifierIdentifiantGestionnaireReseauPage(projetId).match(
        (projet) =>
          response.send(
            ModifierIdentifiantGestionnaireReseauPage({
              request,
              projet,
            })
          ),
        (e) => {
          if (e instanceof EntityNotFoundError) {
            return notFoundResponse({ request, response, ressourceTitle: 'Projet' })
          }

          return errorResponse({ request, response })
        }
      )
    }
  )
)
