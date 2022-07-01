import { userRepo } from '@dataAccess'
import asyncHandler from '../../helpers/asyncHandler'
import routes from '@routes'
import { ensureRole, getPartnersList } from '@config'
import { v1Router } from '../../v1Router'
import { PartnersListPage } from '@views'

v1Router.get(
  routes.ADMIN_PARTNER_USERS,
  ensureRole(['admin']),
  asyncHandler(async (request, response) => {
    const { query } = request
    const validationErrors: Array<{ [fieldName: string]: string }> = Object.entries(query).reduce(
      (errors, [key, value]) => ({
        ...errors,
        ...(key.startsWith('error-') && { [key.replace('error-', '')]: value }),
      }),
      [] as Array<{ [fieldName: string]: string }>
    )
    const users = await getPartnersList()

    return response.send(PartnersListPage({ request, users, validationErrors }))
  })
)
