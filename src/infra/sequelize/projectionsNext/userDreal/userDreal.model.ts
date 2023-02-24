import {
  InferAttributes,
  InferCreationAttributes,
  Model,
  CreationOptional,
  DataTypes,
} from 'sequelize';
import { makeSequelizeProjector } from '../../helpers';
import { sequelizeInstance } from '../../../../sequelize.config';
import { User } from '../users';
import { Région } from '@modules/dreal/région';

class UserDreal extends Model<InferAttributes<UserDreal>, InferCreationAttributes<UserDreal>> {
  id: CreationOptional<number>;
  dreal: Région;
  userId: string;
}

const nomProjection = 'userDreals';

UserDreal.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    dreal: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeInstance,
    tableName: nomProjection,
    timestamps: true,
    freezeTableName: true,
  },
);

UserDreal.belongsTo(User, { foreignKey: 'userId' });

const UserDrealProjector = makeSequelizeProjector(UserDreal, nomProjection);

export { UserDreal, UserDrealProjector };
