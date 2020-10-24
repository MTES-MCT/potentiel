import { credentialsRepo, userRepo } from '../../src/server'

import { makeUser, makeCredentials, User, Credentials } from '../../src/entities'

interface UserProps {
  firstName: User['firstName']
  lastName: User['lastName']
  email: Credentials['email']
  password: string
}

const createUser = async (userProps: UserProps, role: User['role']) => {
  const userResult = makeUser({
    firstName: userProps.firstName,
    lastName: userProps.lastName,
    role,
  })

  if (userResult.is_err()) {
    console.log('createUser.ts cannot create user', userResult.unwrap_err())
    return
  }

  const user = userResult.unwrap()
  const userInsertion = await userRepo.insert(user)

  if (userInsertion.is_err()) {
    console.log('createUser.ts cannot insert user', userInsertion.unwrap_err())
    return
  }

  const credentialsResult = makeCredentials({
    email: userProps.email,
    password: userProps.password,
    userId: user.id,
  })

  if (credentialsResult.is_err()) {
    console.log('createUser.ts cannot create credentials', credentialsResult.unwrap_err())
    return
  }

  const credentialsInsertion = await credentialsRepo.insert(credentialsResult.unwrap())

  if (credentialsInsertion.is_err()) {
    console.log('createUser.ts cannot insert credentials', credentialsInsertion.unwrap_err())
    return
  }

  return user.id
}
export default createUser
