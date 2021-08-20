import { credentialsRepo, userRepo } from '../../../dataAccess'
import { makeCredentials, makeUser, User } from '../../../entities'
import { logger } from '../../../core/utils'

interface CreateUserProps {
  email: User['email']
  fullName: User['fullName']
  password: string
  role: User['role']
}

async function createUser({ email, fullName, password, role }: CreateUserProps) {
  // Create a user object
  const userResult = makeUser({
    fullName,
    email,
    role,
  })
  if (userResult.is_err()) {
    logger.error(userResult.unwrap_err())
    return
  }
  const user = userResult.unwrap()

  // Create the credentials
  const credentialsData = {
    email,
    userId: user.id,
    password,
  }
  const credentialsResult = makeCredentials(credentialsData)

  if (credentialsResult.is_err()) {
    logger.error(credentialsResult.unwrap_err())
    logger.info(credentialsData)
    return
  }

  const credentials = credentialsResult.unwrap()

  // Insert the user in the database
  const userInsertion = await userRepo.insert(user)

  if (userInsertion.is_err()) {
    logger.error(userInsertion.unwrap_err())
    logger.info(user)
    return
  }

  const credentialsInsertion = await credentialsRepo.insert(credentials)
  if (credentialsInsertion.is_err()) {
    logger.error(credentialsInsertion.unwrap_err())
    return
  }

  return user.id
}

export { createUser }
