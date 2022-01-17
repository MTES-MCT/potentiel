import { logger } from '@core/utils'
import { projectRepo } from '../../dataAccess'
import { testRouter } from './testRouter'

testRouter.get('/test/getProjectId', async (request, response) => {
  const { nomProjet } = request.query as any

  if (typeof nomProjet !== 'string') {
    logger.error('getProjectIdForTests wrong/missing nomProjet')
    return response.status(500).send('missing nomProjet')
  }

  const [project] = (await projectRepo.findAll({ nomProjet })).items
  if (!project) {
    return response.status(500).send('No project with this nomProjet')
  }

  return response.send(project.id)
})
