'use strict'

const { fromPersistance } = require('../helpers/fromPersistance')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const projectIds = [
      'ed3ccfda-fb6f-4410-b040-ac325abadc94',
      'ea60df43-a026-11ea-b05c-11293d839ea9',
    ]

    const transaction = await queryInterface.sequelize.transaction()
    try {
      for (const projectId of projectIds) {
        const events = await queryInterface.sequelize.query(
          `SELECT * FROM "eventStores" WHERE "aggregateId" && ? ORDER BY "occurredAt" ASC`,
          {
            type: queryInterface.sequelize.QueryTypes.SELECT,
            replacements: [`{${projectId}}`],
            transaction,
          }
        )

        const lastReimportedEvent = events.filter((e) => e.type === 'ProjectReimported').pop()

        if (lastReimportedEvent) {
          await queryInterface.sequelize.query(
            `DELETE FROM "eventStores" WHERE "id" = '${lastReimportedEvent.id}'`,
            {
              type: queryInterface.sequelize.QueryTypes.DELETE,
              transaction,
            }
          )
        }
      }

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
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
