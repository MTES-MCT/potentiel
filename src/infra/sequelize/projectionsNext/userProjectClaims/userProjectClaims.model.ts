import { Users } from '../users'
import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import { sequelizeInstance } from 'src/sequelize.config'
import { makeSequelizeProjector } from '../../helpers'

class UserProjectClaims extends Model<
  InferAttributes<UserProjectClaims>,
  InferCreationAttributes<UserProjectClaims>
> {
  userId: string
  projectId: string
  failedAttempts: number
}

const nomProjection = 'userProjectClaims'

UserProjectClaims.init(
  {
    userId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    projectId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    failedAttempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize: sequelizeInstance,
    tableName: nomProjection,
    timestamps: true,
    freezeTableName: true,
  }
)

UserProjectClaims.belongsTo(Users, { foreignKey: 'userId' })

const UserProjectClaimsProjector = makeSequelizeProjector(UserProjectClaims, nomProjection)

export { UserProjectClaims, UserProjectClaimsProjector }
