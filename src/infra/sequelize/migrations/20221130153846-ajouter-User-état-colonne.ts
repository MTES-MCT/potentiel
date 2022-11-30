import { DataTypes, QueryInterface } from 'sequelize'

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn('users', 'état', {
      type: DataTypes.ENUM('invité'),
      allowNull: true,
    })
  },

  down: async (queryInterface: QueryInterface) => {
    queryInterface.removeColumn('users', 'état')
  },
}
