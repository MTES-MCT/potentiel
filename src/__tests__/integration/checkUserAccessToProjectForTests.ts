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

const checkUserAccessToProjectForTests = async (request: HttpRequest) => {
  // console.log('checkUserAccessToProjectForTests', request, request.user)
  const { email, nomProjet } = request.body

  if (!email) {
    console.log('checkUserAccessToProjectForTests missing email')
    return SystemError('missing email')
  }

  if (!nomProjet) {
    console.log('checkUserAccessToProjectForTests missing nomProjet')
    return SystemError('missing nomProjet')
  }

  const [project] = (await projectRepo.findAll({ nomProjet })).items
  if (!project) {
    return SystemError('No project with this nomProjet')
  }

  const credentials = await credentialsRepo.findByEmail(email)

  if (credentials.is_none()) {
    return SystemError('No user with this email')
  }

  const access = await userRepo.hasProject(
    credentials.unwrap().userId,
    project.id
  )

  return Success(access.toString())
}

export { checkUserAccessToProjectForTests }
