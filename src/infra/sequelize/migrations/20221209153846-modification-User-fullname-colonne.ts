import { DataTypes, QueryInterface } from 'sequelize'

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.changeColumn('users', 'fullName', {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    })
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.changeColumn('users', 'fullName', {
      type: DataTypes.STRING,
      allowNull: false,
    })
  },
}
