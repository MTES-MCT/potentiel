import { DataTypes } from 'sequelize'
import { sequelizeInstance } from '../../../../sequelize.config'
import { makeSequelizeProjector, SequelizeModel } from '../../helpers'

export const User = sequelizeInstance.define(
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
) as SequelizeModel // Use a special type definition so that sequelize.define always returns a SequelizeModel ?

User.associate = (models) => {}

User.projector = makeSequelizeProjector(User)
