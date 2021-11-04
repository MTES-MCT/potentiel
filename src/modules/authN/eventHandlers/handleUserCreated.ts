import { logger } from '../../../core/utils'
import { User } from '../../../entities'
import { UserCreated } from '../../users'
import { CreateUserCredentials } from '../queries'

interface HandleUserCreatedDeps {
  createUserCredentials: CreateUserCredentials
}

export const handleUserCreated = (deps: HandleUserCreatedDeps) => async (event: UserCreated) => {
  const { email, role, fullName } = event.payload

  try {
    const res = await deps.createUserCredentials({
      email,
      role: role as User['role'],
      fullName,
    })
    if (res.isErr()) {
      throw res.error
    }
  } catch (error) {
    logger.error(error)
  }
}
