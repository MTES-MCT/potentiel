import { TransactionalRepository, UniqueEntityID } from '../../../core/domain'
import { ResultAsync } from '../../../core/utils'
import { User as OldUser } from '../../../entities'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { User } from '../User'

interface CreateUserDeps {
  userRepo: TransactionalRepository<User>
}

interface CreateUserArgs {
  email: string
  fullName?: string
  role: OldUser['role']
  createdBy?: OldUser
}

export const makeCreateUser = (deps: CreateUserDeps) => (
  args: CreateUserArgs
): ResultAsync<string, UnauthorizedError | InfraNotAvailableError> => {
  const { userRepo } = deps
  const { email, role, createdBy, fullName } = args

  return userRepo.transaction(new UniqueEntityID(email), (user) => {
    return user.create({ role, createdBy: createdBy?.id, fullName }).andThen(() => user.getUserId())
  })
}
