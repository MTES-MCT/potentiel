'use strict'

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

        await queryInterface.sequelize.query(`DELETE FROM "eventStores" WHERE "aggregateId" && ?`, {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          replacements: [`{${projectId}}`],
          transaction,
        })

        await queryInterface.sequelize.query(
          `DELETE FROM "eventStores" WHERE type = ? AND "aggregateId" && ?`,
          {
            type: queryInterface.sequelize.QueryTypes.SELECT,
            replacements: ['ProjectRawDataImported', `{f9bc992e-4af5-4b32-a24c-1472203b52b7}`],
            transaction,
          }
        )
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
