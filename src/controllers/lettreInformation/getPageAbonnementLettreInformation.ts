import asyncHandler from '../helpers/asyncHandler'
import routes from '../../routes'
import { AbonnementLettreInformationPage } from '@views'
import { v1Router } from '../v1Router'

v1Router.get(
  routes.ABONNEMENT_LETTRE_INFORMATION,
  asyncHandler(async (request, response) => {
    const { user, query } = request

    const validationErrors: Array<{ [fieldName: string]: string }> = Object.entries(query).reduce(
      (errors, [key, value]) => ({
        ...errors,
        ...(key.startsWith('error-') && { [key.replace('error-', '')]: value }),
      }),
      [] as Array<{ [fieldName: string]: string }>
    )

    return response.send(
      AbonnementLettreInformationPage({
        request,
        ...(validationErrors.length > 0 && { validationErrors }),
        error: query['error']?.toString(),
        success: query['success']?.toString(),
      })
    )
  })
)
