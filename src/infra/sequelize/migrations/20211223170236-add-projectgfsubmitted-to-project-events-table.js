'use strict'

const { ProjectEvent } = require('../projectionsNext')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      const projectEvents = await queryInterface.sequelize.query(
        `SELECT * FROM "eventStores" 
         WHERE type = 'ProjectGFSubmitted' 
          ORDER BY "occurredAt" ASC`,
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction,
        }
      )

      await Promise.all(projectEvents.map((event) => ProjectEvent.projector.handleEvent(event)))

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
