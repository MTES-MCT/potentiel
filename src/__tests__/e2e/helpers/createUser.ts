import { logger } from '@core/utils'
import { userRepo } from '@dataAccess'
import { makeUser, User } from '@entities'
import { UserRole } from '@modules/users'

interface CreateUserProps {
  email: User['email']
  fullName: User['fullName']
  password: string
  role: UserRole
}

async function createUser({ email, fullName, password, role }: CreateUserProps) {
  // Create a user object
  const userResult = makeUser({
    fullName,
    email,
    role,
  })
  if (userResult.isErr()) {
    logger.error(userResult.unwrapErr())
    return
  }
  const user = userResult.unwrap()

  // Insert the user in the database
  const userInsertion = await userRepo.insert(user)

  if (userInsertion.isErr()) {
    logger.error(userInsertion.unwrapErr())
    logger.info(user)
    return
  }

  return user.id
}

export { createUser }
