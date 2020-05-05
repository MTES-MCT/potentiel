import { getUserProject } from '../useCases'
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

  return Success(
    ProjectDetailsPage({
      request,
      project,
    })
  )
}

export { getProjectPage }
