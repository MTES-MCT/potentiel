import { QueryInterface, DataTypes } from 'sequelize'
import { USER_ROLES } from '@modules/users/UserRoles'

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('connexionParRoleEtParJour', {
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
    })

    queryInterface.addConstraint('connexionParRoleEtParJour', {
      fields: ['date', 'role'],
      type: 'unique',
      name: 'date_unique_par_role',
    })
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeConstraint('connexionParRoleEtParJour', 'date_unique_par_role')
    await queryInterface.dropTable('connexionParRoleEtParJour')
  },
}
