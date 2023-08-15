import { ok, Result, wrapInfra } from '../../../../core/utils';
import { User } from "../../projectionsNext";
import { InfraNotAvailableError } from '../../../../modules/shared';
import { GetUserByEmail } from '../../../../modules/users';

export const getUserByEmail: GetUserByEmail = (email) => {
  return wrapInfra(User.findOne({ where: { email } })).andThen(
    (userRaw: any): Result<User | null, InfraNotAvailableError> =>
      userRaw ? ok(userRaw.get()) : ok(null),
  );
};
