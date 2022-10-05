import asyncHandler from '../helpers/asyncHandler'
import routes from '@routes'
import { ensureRole } from '@config'
import { v1Router } from '../v1Router'
import { DatesMiseEnServicePage } from '@views'

if (!!process.env.ENABLE_IMPORT_DATES_MISE_EN_SERVICE) {
  v1Router.get(
    routes.ADMIN_IMPORT_FICHIER_GESTIONNAIRE_RESEAU,
    ensureRole(['admin', 'dgec-validateur']),
    asyncHandler(async (request, response) => {
      return response.send(DatesMiseEnServicePage({ request }))
    })
  )
}
