import { resetDatabase } from '@infra/sequelize/helpers'
import { resetSentEmails } from '@infra/mail'
import { createUser } from './helpers/createUser'
import { testRouter } from './testRouter'

testRouter.get('/test/reset', async (request, response) => {
  // Erase everything from the database
  await resetDatabase()

  // Erase emails
  resetSentEmails()

  // Create a test admin
  await createUser({
    email: 'admin@test.test',
    fullName: 'admin',
    password: 'test',
    role: 'admin',
  })

  // Create a test dreal
  await createUser({
    email: 'dreal@test.test',
    fullName: 'dreal',
    password: 'test',
    role: 'dreal',
  })

  // Create a test porteur projet
  await createUser({
    email: 'porteur-projet@test.test',
    fullName: 'Porteur de Projet',
    password: 'test',
    role: 'porteur-projet',
  })

  return response.send('success')
})
