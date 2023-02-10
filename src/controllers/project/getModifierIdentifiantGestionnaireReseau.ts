import asyncHandler from '../helpers/asyncHandler'
import routes from '@routes'
import { v1Router } from '../v1Router'
import { ModifierIdentifiantGestionnaireReseauPage } from '@views'
import { validateUniqueId } from '../../helpers/validateUniqueId'
import { notFoundResponse } from '../helpers'
import { ensureRole } from '@config'

v1Router.get(
  routes.GET_MODIFIER_IDENTIFIANT_GESTIONNAIRE_RESEAU(),
  ensureRole(['admin', 'dgec-validateur', 'porteur-projet']),
  asyncHandler(async (request, response) => {
    const { projetId } = request.params
    console.log(projetId)

    if (!validateUniqueId(projetId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Projet' })
    }

    // await getProjectDataForChoisirCDCPage(projetId).match(
    //   (projet) => {
    return response.send(
      ModifierIdentifiantGestionnaireReseauPage({
        request,
      })
    )
    // },
    // (e) => {
    //   if (e instanceof EntityNotFoundError) {
    //     return notFoundResponse({ request, response, ressourceTitle: 'Projet' })
    //   }

    //   return errorResponse({ request, response })
    // }
    // )
  })
)
