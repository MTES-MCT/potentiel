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

const getProjectHistoryForTests = async (request: HttpRequest) => {
  // console.log('getProjectHistoryForTests', request, request.user)
  const { nomProjet } = request.query

  if (!nomProjet) {
    console.log('getProjectHistoryForTests missing nomProjet')
    return SystemError('missing nomProjet')
  }

  const project = await projectRepo.findOne({ nomProjet })
  if (!project) {
    return SystemError('No project with this nomProjet')
  }

  const projectWithHistoryRes = await projectRepo.findById(project.id, true)
  if (projectWithHistoryRes.is_none()) {
    return SystemError('No project history with this nomProjet')
  }
  const projectWithHistory = projectWithHistoryRes.unwrap()

  console.log('projectWithHistory', projectWithHistory)

  return Success({ project: projectWithHistory })
}

export { getProjectHistoryForTests }
