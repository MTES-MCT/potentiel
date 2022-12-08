import { DataTypes, QueryInterface } from 'sequelize'

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('projects', 'garantiesFinancieresDueOn')
    await queryInterface.removeColumn('projects', 'garantiesFinancieresRelanceOn')
    await queryInterface.removeColumn('projects', 'garantiesFinancieresSubmittedOn')
    await queryInterface.removeColumn('projects', 'garantiesFinancieresFile')
    await queryInterface.removeColumn('projects', 'garantiesFinancieresSubmittedBy')
    await queryInterface.addColumn('projects', 'garantiesFinancieresDate', {
      type: DataTypes.JSON,
      allowNull: true,
    })
  },

  down: async () => {},
}
