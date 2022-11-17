import { QueryInterface, DataTypes } from 'sequelize'
import { USER_ROLES } from '@modules/users/UserRoles'

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('connexionsParProjetEtParRoleParJour', {
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
    })

    queryInterface.addConstraint('connexionsParProjetEtParRoleParJour', {
      fields: ['projet', 'role', 'date'],
      type: 'unique',
      name: 'projet_unique_par_role_et_par_jour',
    })
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeConstraint(
      'connexionsParProjetEtParRoleParJour',
      'projet_unique_par_role_et_par_jour'
    )
    await queryInterface.dropTable('connexionsParProjetEtParRoleParJour')
  },
}
