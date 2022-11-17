import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize'
import { UserRole, USER_ROLES } from '../../../modules/users'
import { sequelizeInstance } from '../../../sequelize.config'

class ConnexionsParProjetEtParRoleParJour extends Model<
  InferAttributes<ConnexionsParProjetEtParRoleParJour>,
  InferCreationAttributes<ConnexionsParProjetEtParRoleParJour>
> {
  id: CreationOptional<number>
  date: Date
  role: UserRole
  projet: string
  compteur: number
}
ConnexionsParProjetEtParRoleParJour.init(
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
    projet: {
      type: DataTypes.UUID,
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
    tableName: 'connexionsParProjetEtParRoleParJour',
    modelName: 'ConnexionsParProjetEtParRoleParJour',
    timestamps: false,
    freezeTableName: true,
  }
)

export { ConnexionsParProjetEtParRoleParJour }
