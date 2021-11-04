import { UserCreated } from '../../users'
import { handleUserCreated } from './handleUserCreated'

describe('authN.handleUserCreated', () => {
  it('should call createUserCredentials for the email', async () => {
    const createUserCredentials = jest.fn()

    await handleUserCreated({
      createUserCredentials,
    })(
      new UserCreated({
        payload: {
          userId: 'userId',
          email: 'test@test.test',
          role: 'porteur-projet',
          fullName: 'fullName',
        },
      })
    )

    expect(createUserCredentials).toHaveBeenCalledWith({
      email: 'test@test.test',
      role: 'porteur-projet',
      fullName: 'fullName',
    })
  })
})
