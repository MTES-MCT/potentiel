import { resetDatabase } from '../../dataAccess'
import { sequelize } from '../../sequelize.config'
import { Success } from '../../helpers/responses'
import { resetSentEmails } from '../../infra/mail/fakeEmailService'
import { HttpRequest } from '../../types'
import { createUser } from './helpers/createUser'

const resetDbForTests = async (request: HttpRequest) => {
  // Erase everything from the database
  await resetDatabase()
  await sequelize.sync({ force: true })

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

  return Success('success')
}

export { resetDbForTests }
