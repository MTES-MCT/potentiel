import dotenv from 'dotenv'
import testUsers from '../.test-users'
import { credentialsRepo, initDatabase, userRepo } from '../src/dataAccess'
import { makeCredentials, makeUser } from '../src/entities'
import { asLiteral } from '../src/helpers/asLiteral'
dotenv.config()

if (!testUsers) {
  console.log("Can't find .test-users.json file")
  process.exit(1)
}

initDatabase()
  .then(() => {
    return Promise.all(
      testUsers.map(({ email, fullName, password, role }) => {
        const userResult = makeUser({
          email,
          fullName,
          role: asLiteral(role),
        })

        if (userResult.is_err()) {
          console.log('Cannot create user', userResult.unwrap_err())
          return
        }
        const user = userResult.unwrap()

        const credentialsResult = makeCredentials({
          userId: user.id,
          email,
          password,
        })
        if (credentialsResult.is_err()) {
          console.log(
            'Cannot create credentials',
            credentialsResult.unwrap_err()
          )
          return
        }

        const credentials = credentialsResult.unwrap()

        return Promise.all([
          userRepo.insert(user),
          credentialsRepo.insert(credentials),
        ])
      })
    )
  })
  .then(() => {
    console.log('Users were successfuly inserted into db')
    process.exit(0)
  })
  .catch((err) => {
    console.log('Caught error', err)
    process.exit(1)
  })
