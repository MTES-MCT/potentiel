import asyncHandler from '../helpers/asyncHandler'
import routes from '../../routes'
import { v1Router } from '../v1Router'
import { ResetPasswordPage } from '@views'

v1Router.get(
  routes.RESET_PASSWORD,
  asyncHandler(async (request, response) => {
    const { query } = request

    const validationErrors: Array<{ [fieldName: string]: string }> = Object.entries(query).reduce(
      (errors, [key, value]) => ({
        ...errors,
        ...(key.startsWith('error-') && { [key.replace('error-', '')]: value }),
      }),
      [] as Array<{ [fieldName: string]: string }>
    )

    return response.send(
      ResetPasswordPage({
        request,
        ...(validationErrors.length > 0 && { validationErrors }),
        error: query['error']?.toString(),
      })
    )
  })
)
