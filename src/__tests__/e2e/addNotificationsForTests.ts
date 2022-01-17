import { logger } from '@core/utils'
import { testRouter } from './testRouter'

testRouter.post('/test/addNotifications', async (request, response) => {
  const { notifications } = request.body

  if (!notifications) {
    logger.error('tests/addNotificationsForTests missing notifications')
    return response.status(500).send('tests/addNotificationsForTests missing notifications')
  }

  return response.send('success')
})
