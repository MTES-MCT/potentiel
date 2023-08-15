import { describe, expect, it, jest } from '@jest/globals';
import { UserCreated } from '../../users';
import { handleUserCreated } from './handleUserCreated';
import { CreateUserCredentials } from '../queries';

describe('authN.handleUserCreated', () => {
  it('should call createUserCredentials for the email', async () => {
    const createUserCredentials = jest.fn<CreateUserCredentials>();

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
      }),
    );

    expect(createUserCredentials).toHaveBeenCalledWith({
      email: 'test@test.test',
      role: 'porteur-projet',
      fullName: 'fullName',
    });
  });
});
