import { QueryInterface, DataTypes } from 'sequelize'
import { USER_ROLES } from '@modules/users/UserRoles'

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('connexionsParRoleEtParJour', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
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

    // queryInterface.addConstraint('connexionsParRoleEtParJour', {
    //   fields: ['date', 'role'],
    //   type: 'unique',
    //   name: 'date_unique_par_role',
    // })
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeConstraint('connexionsParRoleEtParJour', 'date_unique_par_role')
    await queryInterface.dropTable('connexionsParRoleEtParJour')
  },
}
