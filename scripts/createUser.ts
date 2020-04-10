import { initDatabase, userRepo, credentialsRepo } from '../src/dataAccess'
import { makeUser, makeCredentials } from '../src/entities'

const [_, __, email, password, name] = process.argv

if (!email || !password) {
  console.log('email and password are mandatory')
  console.log('ex: node createUser.js test@test.com test')
  process.exit(1)
}

console.log(
  'Creating user with email ',
  email,
  'and password',
  password,
  'and named',
  name
)

initDatabase()
  .then(() => {
    const userResult = makeUser({
      fullName: name,
      email,
      role: 'admin',
    })

    if (userResult.is_err()) {
      console.log('Cannot create user', userResult.unwrap_err())
      return process.exit(1)
    }
    const user = userResult.unwrap()

    const credentialsResult = makeCredentials({
      userId: userResult.unwrap().id,
      email,
      password,
    })
    if (credentialsResult.is_err()) {
      console.log('Cannot create credentials', credentialsResult.unwrap_err())
      return process.exit(1)
    }

    const credentials = credentialsResult.unwrap()

    return Promise.all([
      userRepo.insert(user),
      credentialsRepo.insert(credentials),
    ])
  })
  .then(([userInsertion, credentialsInsertion]) => {
    if (userInsertion.is_err()) {
      console.log(
        'Oops User could not be inserted into DB',
        userInsertion.unwrap_err()
      )
      return process.exit(1)
    }

    if (credentialsInsertion.is_err()) {
      console.log(
        'Oops Credentials could not be inserted into DB',
        credentialsInsertion.unwrap_err()
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
