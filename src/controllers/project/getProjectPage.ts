import _ from 'lodash'
import { projectAdmissionKeyRepo, projectRepo } from '../../dataAccess'
import routes from '../../routes'
import { getUserProject } from '../../useCases'
import { ProjectDetailsPage } from '../../views/pages'
import { ensureLoggedIn, ensureRole } from '../auth'
import { v1Router } from '../v1Router'
import asyncHandler from 'express-async-handler'

v1Router.get(
  routes.PROJECT_DETAILS(),
  ensureLoggedIn(),
  ensureRole(['admin', 'dgec', 'dreal', 'porteur-projet']),
  asyncHandler(async (request, response) => {
    const { projectId } = request.params

    const project = await getUserProject({ user: request.user, projectId })

    if (!project) {
      return response.status(404).send('Le projet demandé est introuvable')
    }

    // Get the project users
    const projectUsers = await projectRepo.getUsers(project.id)

    // Get the project invitations
    const projectInvitations = (
      await Promise.all([
        projectAdmissionKeyRepo.findAll({
          // invitations for this specific project
          projectId: project.id,
          lastUsedAt: 0,
          cancelled: false,
        }),
        projectAdmissionKeyRepo.findAll({
          // invitations for the email associated with this project
          email: project.email,
          lastUsedAt: 0,
          cancelled: false,
        }),
      ]).then(([projectSpecificInvitations, emailSpecificInvitations]) => {
        // only keep one invitation per email
        return _.uniqBy([...projectSpecificInvitations, ...emailSpecificInvitations], 'email')
      })
    ).filter(
      // Exclude admission keys for users that are already in the user list
      (projectAdmissionKey) =>
        !projectUsers.some((user) => user.email === projectAdmissionKey.email)
    )

    return response.send(
      ProjectDetailsPage({
        request,
        project,
        projectUsers,
        projectInvitations,
      })
    )
  })
)
