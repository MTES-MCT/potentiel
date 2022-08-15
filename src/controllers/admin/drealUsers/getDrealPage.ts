import asyncHandler from '../../helpers/asyncHandler'
import routes from '@routes'
import { ensureRole, getDreals } from '@config'
import { v1Router } from '../../v1Router'
import { DrealListPage } from '@views'

v1Router.get(
  routes.ADMIN_DREAL_LIST,
  ensureRole(['admin', 'dgec-validateur']),
  asyncHandler(async (request, response) => {
    const { query } = request
    const validationErrors: Array<{ [fieldName: string]: string }> = Object.entries(query).reduce(
      (errors, [key, value]) => ({
        ...errors,
        ...(key.startsWith('error-') && { [key.replace('error-', '')]: value }),
      }),
      [] as Array<{ [fieldName: string]: string }>
    )

    const users = await getDreals()

    return response.send(DrealListPage({ request, users, validationErrors }))
  })
)
