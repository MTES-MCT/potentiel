import { ensureRole } from '@config'
import routes from '@routes'
import { DemanderDélaiPage } from '@views'
import asyncHandler from '../helpers/asyncHandler'
import { v1Router } from '../v1Router'

v1Router.get(
  routes.DEMANDER_DELAI(),
  ensureRole(['porteur-projet']),
  asyncHandler(async (request, response) => {
    return response.send(DemanderDélaiPage({ request }))
  })
)
