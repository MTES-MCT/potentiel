import { ResultAsync } from '../../../core/utils';
import { User } from '../../../entities';
import { InfraNotAvailableError } from '../../shared';
import { UserRole } from '../UserRoles';

export interface GetUsersByRole {
  (role: UserRole): ResultAsync<ReadonlyArray<User>, InfraNotAvailableError>;
}
