import { credentialsRepo, userRepo } from '../../src/server'

import {
  makeUser,
  makeCredentials,
  User,
  Credentials
} from '../../src/entities'

interface UserProps {
  firstName: User['firstName']
  lastName: User['lastName']
  email: Credentials['email']
  password: string
}

const createUser = async (user: UserProps, role: User['role']) => {
  const userId = await userRepo.insert(
    makeUser({
      firstName: user.firstName,
      lastName: user.lastName,
      role
    })
  )

  await credentialsRepo.insert(
    makeCredentials({
      email: user.email,
      password: user.password,
      userId
    })
  )

  return userId
}
export default createUser
