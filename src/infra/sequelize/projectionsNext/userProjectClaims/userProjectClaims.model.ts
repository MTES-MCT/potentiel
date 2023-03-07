import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { makeSequelizeProjector } from '../makeSequelizeProjector';

export class UserProjectClaims extends Model<
  InferAttributes<UserProjectClaims>,
  InferCreationAttributes<UserProjectClaims>
> {
  userId: string;
  projectId: string;
  failedAttempts: number;
}

export const UserProjectClaimsProjector = makeSequelizeProjector(UserProjectClaims);
