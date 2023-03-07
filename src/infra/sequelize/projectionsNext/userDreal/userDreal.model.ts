import { InferAttributes, InferCreationAttributes, Model, CreationOptional } from 'sequelize';
import { Région } from '@modules/dreal/région';
import { makeSequelizeProjector } from '../makeSequelizeProjector';

export class UserDreal extends Model<
  InferAttributes<UserDreal>,
  InferCreationAttributes<UserDreal>
> {
  id: CreationOptional<number>;
  dreal: Région;
  userId: string;
}

export const UserDrealProjector = makeSequelizeProjector(UserDreal);
