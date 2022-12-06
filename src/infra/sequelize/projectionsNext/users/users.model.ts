import { UserRole } from '@modules/users'
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize'
import { sequelizeInstance } from 'src/sequelize.config'
import { makeSequelizeProjector } from '../../helpers'

const étatsPossibles = ['invité', 'créé'] as const
type États = typeof étatsPossibles[number]

class Users extends Model<InferAttributes<Users>, InferCreationAttributes<Users>> {
  id: CreationOptional<string>
  email: string
  role: UserRole
  fullName: CreationOptional<string>
  registeredOn: CreationOptional<Date>
  keycloakId: CreationOptional<string>
  fonction: CreationOptional<string>
  état: CreationOptional<États>
}

const nomProjection = 'users'

Users.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
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
  },
  {
    sequelize: sequelizeInstance,
    tableName: nomProjection,
    timestamps: true,
    freezeTableName: true,
  }
)

const UsersProjector = makeSequelizeProjector(Users, nomProjection)

export { Users, UsersProjector }
