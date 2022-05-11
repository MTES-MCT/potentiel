import { userRepo } from '@dataAccess'
import asyncHandler from '../../helpers/asyncHandler'
import routes from '../../../routes'
import { ensureRole } from '@config'
import { v1Router } from '../../v1Router'
import { DrealListPage } from '@views'

v1Router.get(
  routes.ADMIN_DREAL_LIST,
  ensureRole('admin'),
  asyncHandler(async (request, response) => {
    const { query } = request
    const validationErrors: Array<{ [fieldName: string]: string }> = Object.entries(query).reduce(
      (errors, [key, value]) => ({
        ...errors,
        ...(key.startsWith('error-') && { [key.replace('error-', '')]: value }),
      }),
      [] as Array<{ [fieldName: string]: string }>
    )
    // Get all dreal users
    const drealUsers = await userRepo.findAll({ role: 'dreal' })

    const users = await Promise.all(
      drealUsers.map(async (user) => {
        const dreals = await userRepo.findDrealsForUser(user.id)
        return { user, dreals }
      })
    )

    return response.send(DrealListPage({ request, users, validationErrors }))
  })
)
