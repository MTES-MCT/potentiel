import { QueryInterface, Sequelize } from 'sequelize'

export default {
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    await queryInterface.renameColumn(
      'projects',
      'newRulesOptIn',
      'nouvellesRèglesDInstructionChoisies'
    )
  },

  down: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {},
}
