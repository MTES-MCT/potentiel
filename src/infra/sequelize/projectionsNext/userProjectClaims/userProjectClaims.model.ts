import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { makeSequelizeProjector } from '../../helpers';

export class UserProjectClaims extends Model<
  InferAttributes<UserProjectClaims>,
  InferCreationAttributes<UserProjectClaims>
> {
  userId: string;
  projectId: string;
  failedAttempts: number;
}

export const userProjectClaimsTableName = 'userProjectClaims';

export const UserProjectClaimsProjector = makeSequelizeProjector(
  UserProjectClaims,
  userProjectClaimsTableName,
);
