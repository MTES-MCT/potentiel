import asyncHandler from './helpers/asyncHandler'
import routes from '../routes'
import { AbonnementLettreInformationPage } from '@views'
import { v1Router } from './v1Router'

v1Router.get(
  routes.ABONNEMENT_LETTRE_INFORMATION,
  asyncHandler(async (request, response) => {
    response.send(
      AbonnementLettreInformationPage({
        request,
      })
    )
  })
)
