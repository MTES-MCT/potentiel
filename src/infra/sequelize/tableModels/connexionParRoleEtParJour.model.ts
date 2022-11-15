import { DataTypes } from 'sequelize'
import { USER_ROLES } from '@modules/users/UserRoles'
export const connexionParRoleEtParJourModel = (sequelize) => {
  const ConnexionParRoleEtParJourModel = sequelize.define(
    'connexionParRoleEtParJourModel',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      date: {
        type: DataTypes.STRING,
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
      timestamps: true,
    }
  )

  return ConnexionParRoleEtParJourModel
}
