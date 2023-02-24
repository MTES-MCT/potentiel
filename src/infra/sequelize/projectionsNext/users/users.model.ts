import { UserRole } from '@modules/users';
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelizeInstance } from '../../../../sequelize.config';
import { makeSequelizeProjector } from '../../helpers';

const étatsPossibles = ['invité', 'créé'] as const;
type États = typeof étatsPossibles[number];

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
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

const nomProjection = 'users';

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    registeredOn: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    keycloakId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    fonction: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    état: {
      type: DataTypes.ENUM(...étatsPossibles),
      allowNull: true,
    },

    createdAt: DataTypes.DATE,
  },
  {
    sequelize: sequelizeInstance,
    tableName: nomProjection,
    timestamps: true,
    freezeTableName: true,
  },
);

const UserProjector = makeSequelizeProjector(User, nomProjection);

export { User, UserProjector };
