import { CreateUser, UserRole } from '../../modules/users'
import { okAsync } from '../../core/utils'

type FakeCreateUserArgs = {
  id?: string
  role?: UserRole
}

const makeFakeCreateUser: (fake?: FakeCreateUserArgs) => CreateUser = (fake) =>
  jest.fn((createUserArgs) => {
    return okAsync({
      id: fake?.id ?? 'user-id',
      role: fake?.role ?? createUserArgs.role ?? 'porteur-projet',
    })
  })

export { makeFakeCreateUser }
