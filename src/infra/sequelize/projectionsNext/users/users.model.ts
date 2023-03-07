import { UserRole } from '@modules/users';
import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { makeSequelizeProjector } from '../makeSequelizeProjector';

export const étatsUser = ['invité', 'créé'] as const;
type États = typeof étatsUser[number];

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  id: CreationOptional<string>;
  email: string;
  role: UserRole;
  fullName: CreationOptional<string>;
  registeredOn: CreationOptional<Date | null>;
  keycloakId: CreationOptional<string>;
  fonction: CreationOptional<string>;
  état: CreationOptional<États>;
  createdAt: CreationOptional<Date>;
}

export const UserProjector = makeSequelizeProjector(User);
