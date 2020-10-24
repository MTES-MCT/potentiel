import { userRepo, projectAdmissionKeyRepo } from '../dataAccess'
import { Redirect, Success } from '../helpers/responses'
import { HttpRequest } from '../types'
import { DrealListPage } from '../views/pages'
import ROUTES from '../routes'

const getDrealPage = async (request: HttpRequest) => {
  if (!request.user) {
    return Redirect(ROUTES.LOGIN)
  }

  // Get all dreal users
  const drealUsers = await userRepo.findAll({ role: 'dreal' })
  const users = await Promise.all(
    drealUsers.map(async (user) => {
      const dreals = await userRepo.findDrealsForUser(user.id)
      return { user, dreals }
    })
  )

  // Get all invitations for dreals
  const invitations = await projectAdmissionKeyRepo.findAll({
    dreal: -1,
    lastUsedAt: 0,
  })

  return Success(DrealListPage({ request, users, invitations }))
}

export { getDrealPage }
