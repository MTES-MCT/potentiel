'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('project_steps', 'status', {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
    })

    queryInterface.addColumn('project_steps', 'statusUpdatedBy', {
      type: Sequelize.DataTypes.UUID,
      allowNull: true,
    })

    queryInterface.addColumn('project_steps', 'statusUpdatedOn', {
      type: Sequelize.DataTypes.DATE,
      allowNull: true,
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('project_steps', 'status')
    queryInterface.removeColumn('project_steps', 'statusUpdatedBy')
    queryInterface.removeColumn('project_steps', 'statusUpdatedOn')
  },
}
