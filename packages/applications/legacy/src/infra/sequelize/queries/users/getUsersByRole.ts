import { ok, Result, wrapInfra } from '../../../../core/utils';
import { User } from '../../projectionsNext';
import { InfraNotAvailableError } from '../../../../modules/shared';
import { GetUsersByRole } from '../../../../modules/users';

export const getUsersByRole: GetUsersByRole = (role) => {
  return wrapInfra(User.findAll({ where: { role } })).andThen(
    (users): Result<User[], InfraNotAvailableError> => ok(users),
  );
};
