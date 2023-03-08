import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

export class UserProjectClaims extends Model<
  InferAttributes<UserProjectClaims>,
  InferCreationAttributes<UserProjectClaims>
> {
  userId: string;
  projectId: string;
  failedAttempts: number;
}
