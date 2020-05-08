import {
  projectRepo,
  userRepo,
  projectAdmissionKeyRepo,
  credentialsRepo,
} from '../../dataAccess'
import { User, makeProject, makeProjectAdmissionKey } from '../../entities'
import { Success, SystemError } from '../../helpers/responses'
import { HttpRequest } from '../../types'
import ROUTES from '../../routes'
import makeFakeProject from '../fixtures/project'
import { createUser } from './helpers/createUser'

const getProjectIdForTests = async (request: HttpRequest) => {
  // console.log('getProjectIdForTests', request, request.user)
  const { nomProjet } = request.query

  if (!nomProjet) {
    console.log('getProjectIdForTests missing nomProjet')
    return SystemError('missing nomProjet')
  }

  const [project] = await projectRepo.findAll({ nomProjet })
  if (!project) {
    return SystemError('No project with this nomProjet')
  }

  return Success(project.id)
}

export { getProjectIdForTests }
