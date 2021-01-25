import { projectRepo, userRepo, credentialsRepo } from '../../dataAccess'
import { Success, SystemError } from '../../helpers/responses'
import { HttpRequest } from '../../types'
import { logger } from '../../core/utils'

const checkUserAccessToProjectForTests = async (request: HttpRequest) => {
  const { email, nomProjet } = request.body

  if (!email) {
    logger.error('checkUserAccessToProjectForTests missing email')
    return SystemError('missing email')
  }

  if (!nomProjet) {
    logger.error('checkUserAccessToProjectForTests missing nomProjet')
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

  const access = await userRepo.hasProject(credentials.unwrap().userId, project.id)

  return Success(access.toString())
}

export { checkUserAccessToProjectForTests }
