import { DataTypes, QueryInterface } from 'sequelize'

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.changeColumn('projects', 'cahierDesChargesActuel', {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'initial',
    })
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.sequelize.query(`drop type enum_projects_cahierDesChargesActuel;`)
    await queryInterface.changeColumn('projects', 'cahierDesChargesActuel', {
      type: DataTypes.ENUM('initial', '30/07/2021', '30/08/2022', '30/08/2022-alternatif'),
      allowNull: false,
      defaultValue: 'initial',
    })
  },
}
