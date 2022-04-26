'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.sequelize.query(
        `DELETE FROM "eventStores" 
        WHERE type='LegacyModificationImported' 
        AND "occurredAt" < '2022-01-01T00:00:00.000Z'`,
        {
          type: queryInterface.sequelize.QueryTypes.DELETE,
          transaction,
        }
      )

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
