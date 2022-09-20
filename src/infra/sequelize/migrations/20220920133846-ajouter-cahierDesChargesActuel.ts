import { DataTypes, QueryInterface, Sequelize } from 'sequelize'

export default {
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    await queryInterface.addColumn('projects', 'cahierDesChargesActuel', {
      type: DataTypes.ENUM('initial', '30/07/2021', '30/08/2022', '30/08/2022-alternatif'),
      allowNull: false,
      defaultValue: 'initial',
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('users', 'fonction')
  },
}
