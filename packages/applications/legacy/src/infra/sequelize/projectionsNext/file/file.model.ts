import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

export class File extends Model<InferAttributes<File>, InferCreationAttributes<File>> {
  id: string;
  filename: string;
  forProject?: string;
  createdBy?: string;
  designation: string;
  storedAt?: string;
  createdAt: CreationOptional<Date>;
}

export const fileTableName = 'files';
