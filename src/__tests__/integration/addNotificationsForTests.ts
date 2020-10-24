import { Success, SystemError } from '../../helpers/responses'
import { HttpRequest } from '../../types'

const addNotificationsForTests = async (request: HttpRequest) => {
  const { notifications } = request.body

  if (!notifications) {
    console.log('tests/addNotificationsForTests missing notifications')
    return SystemError('tests/addNotificationsForTests missing notifications')
  }

  return Success('success')
}

export { addNotificationsForTests }
