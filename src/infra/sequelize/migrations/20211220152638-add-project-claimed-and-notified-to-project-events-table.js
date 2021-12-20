'use strict'

const { ProjectEvent } = require('../projectionsNext')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      const projectClaimedOrNotifiedEvents = await queryInterface.sequelize.query(
        `SELECT * FROM "eventStores" WHERE type in ('ProjectClaimed', 'ProjectNotified')`,
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction,
        }
      )

      for (const event of projectClaimedOrNotifiedEvents) {
        await ProjectEvent.projector.handleEvent(event)
      }

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
