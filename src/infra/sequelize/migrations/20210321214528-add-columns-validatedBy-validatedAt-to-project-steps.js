'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('project_steps', 'status', {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
    })

    queryInterface.addColumn('project_steps', 'statusSubmittedBy', {
      type: Sequelize.DataTypes.UUID,
      allowNull: true,
    })

    queryInterface.addColumn('project_steps', 'statusSubmittedAt', {
      type: Sequelize.DataTypes.DATE,
      allowNull: true,
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('project_steps', 'status')
    queryInterface.removeColumn('project_steps', 'statusSubmittedBy')
    queryInterface.removeColumn('project_steps', 'statusSubmittedAt')
  },
}
