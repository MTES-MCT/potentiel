import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { UserRole, USER_ROLES } from '../../../modules/users';
import { sequelizeInstance } from '../../../sequelize.config';

class ConnexionsParRoleEtParJour extends Model<
  InferAttributes<ConnexionsParRoleEtParJour>,
  InferCreationAttributes<ConnexionsParRoleEtParJour>
> {
  id: CreationOptional<number>;
  date: Date;
  role: UserRole;
  compteur: number;
}
ConnexionsParRoleEtParJour.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...USER_ROLES),
      allowNull: false,
    },
    compteur: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['id'],
      },
    ],
    sequelize: sequelizeInstance,
    tableName: 'connexionsParRoleEtParJour',
    modelName: 'ConnexionsParRoleEtParJour',
    timestamps: false,
    freezeTableName: true,
  },
);

export { ConnexionsParRoleEtParJour };
