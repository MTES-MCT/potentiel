import dotenv from 'dotenv'
import { credentialsRepo, initDatabase, userRepo } from '../src/dataAccess'
import { makeCredentials, makeUser } from '../src/entities'
dotenv.config()

const [_, __, email, password, name] = process.argv

if (!email || !password) {
  console.log('email and password are mandatory')
  console.log('ex: node createUser.js test@test.com test')
  process.exit(1)
}

console.log('Creating user with email ', email, 'and password', password, 'and named', name)

initDatabase()
  .then(() => {
    const userResult = makeUser({
      fullName: name,
      email,
      role: 'admin',
    })

    if (userResult.isErr()) {
      console.log('Cannot create user', userResult.unwrapErr())
      return process.exit(1)
    }
    const user = userResult.unwrap()

    const credentialsResult = makeCredentials({
      userId: userResult.unwrap().id,
      email,
      password,
    })
    if (credentialsResult.isErr()) {
      console.log('Cannot create credentials', credentialsResult.unwrapErr())
      return process.exit(1)
    }

    const credentials = credentialsResult.unwrap()

    return Promise.all([userRepo.insert(user), credentialsRepo.insert(credentials)])
  })
  .then(([userInsertion, credentialsInsertion]) => {
    if (userInsertion.isErr()) {
      console.log('Oops User could not be inserted into DB', userInsertion.unwrapErr())
      return process.exit(1)
    }

    if (credentialsInsertion.isErr()) {
      console.log(
        'Oops Credentials could not be inserted into DB',
        credentialsInsertion.unwrapErr()
      )
      return process.exit(1)
    }

    console.log('User was successfuly inserted into db')
    process.exit(0)
  })
  .catch((err) => {
    console.log('Caught error', err)
    process.exit(1)
  })
