import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

export class Notification extends Model<
  InferAttributes<Notification>,
  InferCreationAttributes<Notification>
> {
  id: string;
  type: string;
  message: Record<string, string>;
  context: Record<string, string>;
  variables: Record<string, string>;
  status: string;
  error?: string;
  createdAt: CreationOptional<Date>;
}

export const notificationTableName = 'notifications';
