import { Success, SystemError } from '../../helpers/responses'
import { HttpRequest } from '../../types'
import { createUser } from './helpers/createUser'
import { logger } from '../../core/utils'

const createUserWithEmailForTests = async (request: HttpRequest) => {
  const { email } = request.body

  if (!email) {
    logger.error('createUserWithEmailForTests missing email')
    return SystemError('missing email')
  }

  // Create a test porteur projet
  const userId = await createUser({
    email,
    fullName: 'Porteur de Projet',
    password: 'test',
    role: 'porteur-projet',
  })

  return Success(userId || '')
}

export { createUserWithEmailForTests }
