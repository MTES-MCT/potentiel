import { logger } from '@core/utils'
import { projectRepo } from '../../dataAccess'
import { testRouter } from './testRouter'

testRouter.get('/test/getProject', async (request, response) => {
  const { nomProjet } = request.query as any

  if (!nomProjet) {
    logger.error('getProjectHistoryForTests missing nomProjet')
    return response.status(500).send('missing nomProjet')
  }

  const project = await projectRepo.findOne({ nomProjet })
  if (!project) {
    return response.status(500).send('No project with this nomProjet')
  }

  const projectWithHistory = await projectRepo.findById(project.id, true)
  if (!projectWithHistory) {
    return response.status(500).send('No project history with this nomProjet')
  }

  return response.send({ project: projectWithHistory })
})
