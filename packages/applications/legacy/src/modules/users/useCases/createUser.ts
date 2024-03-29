import { UserRole } from '..';
import { TransactionalRepository, UniqueEntityID } from '../../../core/domain';
import { ResultAsync } from '../../../core/utils';
import { User as OldUser } from '../../../entities';
import { EmailAlreadyUsedError, InfraNotAvailableError, UnauthorizedError } from '../../shared';
import { User } from '../User';

export type CreateUser = ReturnType<typeof makeCreateUser>;

interface CreateUserDeps {
  userRepo: TransactionalRepository<User>;
}

interface CreateUserArgs {
  email: string;
  fullName?: string;
  role?: UserRole;
  createdBy?: OldUser;
}

export interface CreateUserResult {
  id: string;
  role: UserRole;
}

export const makeCreateUser =
  (deps: CreateUserDeps) =>
  (
    args: CreateUserArgs,
  ): ResultAsync<
    CreateUserResult,
    UnauthorizedError | InfraNotAvailableError | EmailAlreadyUsedError
  > => {
    const { userRepo } = deps;

    const { email, role = 'porteur-projet', createdBy, fullName } = args;

    return userRepo.transaction(
      new UniqueEntityID(email),
      (user) => {
        return user
          .create({ role, createdBy: createdBy?.id, fullName })
          .andThen(user.getUserId)
          .map((id) => ({ id, role }));
      },
      { acceptNew: true },
    );
  };
