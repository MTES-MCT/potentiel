import { QueryInterface, Sequelize } from 'sequelize'

export default {
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    queryInterface.removeColumn('projects', 'nouvellesRèglesDInstructionChoisies')
  },

  down: async (queryInterface, Sequelize) => {},
}
