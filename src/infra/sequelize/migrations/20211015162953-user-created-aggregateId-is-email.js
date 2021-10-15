'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.sequelize.query(
        `UPDATE "eventStores" SET "aggregateId" = string_to_array(trim(both '"' from (payload->'email')::varchar), '','') WHERE type = 'UserCreated' `,
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

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
}
