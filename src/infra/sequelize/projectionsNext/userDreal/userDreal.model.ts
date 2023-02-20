import {
  InferAttributes,
  InferCreationAttributes,
  Model,
  CreationOptional,
} from 'sequelize'
import { makeSequelizeProjector } from '../../helpers'

class UserDreal extends Model<InferAttributes<UserDreal>, InferCreationAttributes<UserDreal>> {
  id: CreationOptional<number>
  dreal: string
  userId: string
}

const nomProjection = 'userDreal'

// UserDreal.init({
//       id: {
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         type: DataTypes.INTEGER,
//       },
//       dreal: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       userId: {
//         type: DataTypes.UUID,
//         allowNull: false,
//       },
//     },
//     {
//       timestamps: true,
//     }
//   )

//   UserDreal.associate = (models) => {
//     const { User } = models

//     UserDreal.belongsTo(User, { foreignKey: 'userId' })
//   }

//   return UserDreal
// }

const UserDrealProjector = makeSequelizeProjector(UserDreal, nomProjection)
