'use strict'

const { fromPersistance } = require('../helpers/fromPersistance')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const projectIds = [
      '5ae063cf-3f31-421b-9d76-553e14f2b405',
      '0169d9c8-148a-4764-8b52-021685144cad',
      '6c4ce2b7-81d2-486c-9d94-bb5417093be0',
    ]

    const transaction = await queryInterface.sequelize.transaction()
    try {
      for (const projectId of projectIds) {
        await queryInterface.sequelize.query(`DELETE FROM "projects" WHERE "id" = ?`, {
          type: queryInterface.sequelize.QueryTypes.DELETE,
          replacements: [projectId],
          transaction,
        })

        const events = await queryInterface.sequelize.query(
          `SELECT * FROM "eventStores" WHERE "aggregateId" && ?`,
          {
            type: queryInterface.sequelize.QueryTypes.SELECT,
            replacements: [`{${projectId}}`],
            transaction,
          }
        )

        if (events && events.length) {
          const importedEvent = fromPersistance(
            events.filter((e) => e.type === 'ProjectImported').pop()
          )
          const {
            payload: { importId },
          } = importedEvent

          const rawImportedEvents = await queryInterface.sequelize.query(
            `SELECT * FROM "eventStores" WHERE type = ? AND "aggregateId" && ?`,
            {
              type: queryInterface.sequelize.QueryTypes.SELECT,
              replacements: ['ProjectRawDataImported', `{${importId}}`],
              transaction,
            }
          )

          const eventsToDelete = events
            .concat(rawImportedEvents)
            .filter((event) => event !== null)
            .map(fromPersistance)

          await queryInterface.sequelize.query(
            `DELETE FROM "eventStores" WHERE "id" IN (${eventsToDelete
              .map((e) => `'${e.id}'`)
              .join(',')})`,
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
