import { projectAdmissionKeyRepo, userRepo } from '../../dataAccess'
import routes from '../../routes'
import { DrealListPage } from '../../views/pages'
import { ensureLoggedIn, ensureRole } from '../auth'
import { v1Router } from '../v1Router'

v1Router.get(
  routes.ADMIN_DREAL_LIST,
  ensureLoggedIn(),
  ensureRole('admin'),
  async (request, response) => {
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

    return response.send(DrealListPage({ request, users, invitations }))
  }
)
