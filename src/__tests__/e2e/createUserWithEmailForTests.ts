import { logger } from '@core/utils'
import { createUser } from './helpers/createUser'
import { testRouter } from './testRouter'

testRouter.post('/test/createUserWithEmail', async (request, response) => {
  const { email } = request.body

  if (!email) {
    logger.error('createUserWithEmailForTests missing email')
    return response.status(500).send('missing email')
  }

  // Create a test porteur projet
  const userId = await createUser({
    email,
    fullName: 'Porteur de Projet',
    password: 'test',
    role: 'porteur-projet',
  })

  return response.send(userId || '')
})
