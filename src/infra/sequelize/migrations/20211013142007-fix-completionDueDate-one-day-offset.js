'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      const CompletionDueDateSetEvents = await queryInterface.sequelize.query(
        'SELECT * FROM "eventStores" WHERE type = ?',
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          replacements: ['ProjectCompletionDueDateSet'],
          transaction,
        }
      )

      for (const event of CompletionDueDateSetEvents) {
        const { id, payload } = event

        // Remove one day
        payload.completionDueOn = event.payload.completionDueOn - 24 * 3600 * 1000

        await queryInterface.sequelize.query('UPDATE "eventStores" SET payload = ? WHERE id = ?', {
          type: queryInterface.sequelize.UPDATE,
          replacements: [JSON.stringify(payload), id],
          transaction,
        })
      }

      await queryInterface.sequelize.query(
        'UPDATE "projects" SET "completionDueOn"="completionDueOn"-24*3600*1000 WHERE "completionDueOn" != 0',
        {
          type: queryInterface.sequelize.UPDATE,
          transaction,
        }
      )

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },

  down: async (queryInterface, Sequelize) => {},
}
