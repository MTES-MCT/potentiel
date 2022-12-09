import { DataTypes, QueryInterface } from 'sequelize'

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.changeColumn('users', 'état', {
      type: DataTypes.STRING,
      allowNull: true,
    })
    await queryInterface.sequelize.query(`drop type enum_users_état;`)
    await queryInterface.changeColumn('users', 'état', {
      type: DataTypes.ENUM('invité', 'créé'),
      allowNull: true,
    })
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.changeColumn('users', 'état', {
      type: DataTypes.STRING,
      allowNull: true,
    })
    await queryInterface.sequelize.query(`drop type enum_users_état;`)
    await queryInterface.changeColumn('users', 'état', {
      type: DataTypes.ENUM('invité'),
      allowNull: true,
    })
  },
}
