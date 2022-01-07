'use strict'

const { ProjectEvent } = require('../projectionsNext')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.addColumn('project_events', 'eventPublishedAt', {
        type: Sequelize.DataTypes.BIGINT,
        transaction,
      })

      await ProjectEvent.projector.rebuild(transaction)

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
}
