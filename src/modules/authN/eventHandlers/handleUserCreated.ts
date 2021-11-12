import { logger } from '../../../core/utils'
import { UserCreated, UserRole } from '../../users'
import { CreateUserCredentials } from '../queries'

interface HandleUserCreatedDeps {
  createUserCredentials: CreateUserCredentials
}

export const handleUserCreated = (deps: HandleUserCreatedDeps) => async (event: UserCreated) => {
  const { email, role, fullName } = event.payload

  try {
    const res = await deps.createUserCredentials({
      email,
      role: role as UserRole,
      fullName,
    })
    if (res.isErr()) {
      throw res.error
    }
  } catch (error) {
    logger.error(error)
  }
}
