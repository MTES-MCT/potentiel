import { getUserByEmail } from '../../config'
import { logger } from '../../core/utils'
import { projectRepo, userRepo } from '../../dataAccess'
import { testRouter } from './testRouter'

testRouter.post('/test/checkUserAccessToProject', async (request, response) => {
  const { email, nomProjet } = request.body

  if (!email) {
    logger.error('checkUserAccessToProjectForTests missing email')
    return response.status(500).send('missing email')
  }

  if (!nomProjet) {
    logger.error('checkUserAccessToProjectForTests missing nomProjet')
    return response.status(500).send('missing nomProjet')
  }

  const [project] = (await projectRepo.findAll({ nomProjet })).items
  if (!project) {
    return response.status(500).send('No project with this nomProjet')
  }

  const userResult = await getUserByEmail(email)

  if (userResult.isErr() || userResult.value === null) {
    return response.status(500).send('No user with this email')
  }

  const access = await userRepo.hasProject(userResult.value.id, project.id)

  return response.send(access.toString())
})
