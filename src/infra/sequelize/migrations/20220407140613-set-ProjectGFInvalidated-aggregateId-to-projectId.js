'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      const projectGFInvalidatedEvents = await queryInterface.sequelize.query(
        'SELECT * FROM "eventStores" WHERE type = ?',
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          replacements: ['ProjectGFInvalidated'],
          transaction,
        }
      )

      for (const event of projectGFInvalidatedEvents) {
        const { id, payload } = event

        const { projectId } = payload
        await queryInterface.sequelize.query(
          'UPDATE "eventStores" SET "aggregateId" = ? WHERE id = ?',
          {
            type: queryInterface.sequelize.UPDATE,
            replacements: [`{${projectId}}`, id],
            transaction,
          }
        )
      }
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
}
