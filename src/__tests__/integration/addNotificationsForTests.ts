import { Success, SystemError } from '../../helpers/responses'
import { HttpRequest } from '../../types'
import { logger } from '../../core/utils'

const addNotificationsForTests = async (request: HttpRequest) => {
  const { notifications } = request.body

  if (!notifications) {
    logger.error('tests/addNotificationsForTests missing notifications')
    return SystemError('tests/addNotificationsForTests missing notifications')
  }

  return Success('success')
}

export { addNotificationsForTests }
