import { DataTypes } from 'sequelize'
import { sequelizeInstance } from '../../../../sequelize.config'
import { makeSequelizeProjection, SequelizeModel } from '../../helpers'

const UserModel = sequelizeInstance.define(
  'user',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
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
  },
  {
    timestamps: true,
  }
) as SequelizeModel

UserModel.associate = (models) => {}

export const usersProjection = makeSequelizeProjection(UserModel)
