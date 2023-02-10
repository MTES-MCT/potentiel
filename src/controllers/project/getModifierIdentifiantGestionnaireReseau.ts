import { object, string } from 'yup'

import routes from '@routes'
import { v1Router } from '../v1Router'
import { ModifierIdentifiantGestionnaireReseauPage } from '@views'
import { errorResponse, notFoundResponse } from '../helpers'
import { ensureRole, getProjectDataForModifierIdentifiantGestionnaireReseauPage } from '@config'
import safeAsyncHandler from '../helpers/safeAsyncHandler'
import { EntityNotFoundError } from '@modules/shared'

const schema = object({
  params: object({
    projetId: string().uuid().required(),
  }),
})

v1Router.get(
  routes.GET_MODIFIER_IDENTIFIANT_GESTIONNAIRE_RESEAU(),
  ensureRole(['admin', 'dgec-validateur', 'porteur-projet']),
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
