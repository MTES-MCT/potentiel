import _ from 'lodash'

import { getUserProject } from '../useCases'
import { projectRepo, projectAdmissionKeyRepo } from '../dataAccess'
import { Redirect, Success, NotFoundError } from '../helpers/responses'
import { HttpRequest } from '../types'
import { ProjectDetailsPage } from '../views/pages'
import ROUTES from '../routes'

const getProjectPage = async (request: HttpRequest) => {
  const { projectId } = request.params

  if (!request.user) {
    return Redirect(ROUTES.LOGIN)
  }

  const project = await getUserProject({ user: request.user, projectId })

  if (!project) {
    return NotFoundError('Le projet demandé est introuvable')
  }

  // Get the project users
  const projectUsers = await projectRepo.getUsers(project.id)

  // Get the project invitations
  const projectInvitations = (
    await Promise.all([
      projectAdmissionKeyRepo.findAll({
        // invitations for this specific project
        projectId: project.id,
      }),
      projectAdmissionKeyRepo.findAll({
        // invitations for the email associated with this project
        email: project.email,
      }),
    ]).then(([projectSpecificInvitations, emailSpecificInvitations]) => {
      // only keep one invitation per email
      return _.uniqBy([...projectSpecificInvitations, ...emailSpecificInvitations], 'email')
    })
  ).filter(
    // Exclude admission keys for users that are already in the user list
    (projectAdmissionKey) => !projectUsers.some((user) => user.email === projectAdmissionKey.email)
  )

  return Success(
    ProjectDetailsPage({
      request,
      project,
      projectUsers,
      projectInvitations,
    })
  )
}

export { getProjectPage }
