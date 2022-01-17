import { ok } from '@core/utils'
import { User as OldUser } from '../../../entities'
import { fakeTransactionalRepo, makeFakeUser } from '../../../__tests__/fixtures/aggregates'
import { EntityNotFoundError } from '../../shared'
import { User } from '../User'
import { makeCreateUser } from './createUser'

describe('createUser use-case', () => {
  const fakeEmail = 'test@test.test'

  it('should open a transaction on the User and call create()', async () => {
    const fakeUser = {
      ...makeFakeUser(),
    }
    const userRepo = fakeTransactionalRepo(fakeUser as User)

    const createUser = makeCreateUser({
      userRepo,
    })

    await createUser({
      email: fakeEmail,
      role: 'porteur-projet',
      fullName: 'fullName',
      createdBy: {
        id: 'createdBy',
      } as OldUser,
    })

    expect(fakeUser.create).toHaveBeenCalledWith({
      role: 'porteur-projet',
      fullName: 'fullName',
      createdBy: 'createdBy',
    })
  })

  it('should return the userId and the role', async () => {
    const fakeUser = {
      ...makeFakeUser(),
      getUserId: jest.fn(() => ok<string, EntityNotFoundError>('userId')),
    }
    const userRepo = fakeTransactionalRepo(fakeUser as User)

    const createUser = makeCreateUser({
      userRepo,
    })

    const res = await createUser({
      email: fakeEmail,
      role: 'admin',
      fullName: 'fullName',
      createdBy: {
        id: 'createdBy',
      } as OldUser,
    })

    expect(res._unsafeUnwrap()).toEqual({ id: 'userId', role: 'admin' })
  })

  describe(`when no role is given for the creation`, () => {
    it(`should call create with the role 'porteur-projet'`, async () => {
      const fakeUser = {
        ...makeFakeUser(),
        getUserId: jest.fn(() => ok<string, EntityNotFoundError>('userId')),
      }
      const userRepo = fakeTransactionalRepo(fakeUser as User)

      const createUser = makeCreateUser({
        userRepo,
      })

      await createUser({
        email: fakeEmail,
        fullName: 'fullName',
        createdBy: {
          id: 'createdBy',
        } as OldUser,
      })

      expect(fakeUser.create).toHaveBeenCalledWith({
        role: 'porteur-projet',
        fullName: 'fullName',
        createdBy: 'createdBy',
      })
    })
  })
})
