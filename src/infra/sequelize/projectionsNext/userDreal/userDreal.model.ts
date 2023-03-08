import { InferAttributes, InferCreationAttributes, Model, CreationOptional } from 'sequelize';
import { Région } from '@modules/dreal/région';

export class UserDreal extends Model<
  InferAttributes<UserDreal>,
  InferCreationAttributes<UserDreal>
> {
  id: CreationOptional<number>;
  dreal: Région;
  userId: string;
}
