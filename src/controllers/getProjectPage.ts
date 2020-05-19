import { getUserProject } from '../useCases'
import { projectRepo, projectAdmissionKeyRepo } from '../dataAccess'
import { Redirect, Success, NotFoundError } from '../helpers/responses'
import { Controller, HttpRequest } from '../types'
import { ProjectDetailsPage } from '../views/pages'
import ROUTES from '../routes'

const getProjectPage = async (request: HttpRequest) => {
  // console.log('Call to getProjectPage received', request.body, request.file)
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
    await projectAdmissionKeyRepo.findAll({
      projectId: project.id,
    })
  ).filter(
    // Exclude admission keys for users that are already in the user list
    (projectAdmissionKey) =>
      !projectUsers.some((user) => user.email === projectAdmissionKey.email)
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
