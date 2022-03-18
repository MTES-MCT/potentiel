'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.sequelize.query(`DELETE FROM "users" WHERE "id" = ?`, {
        type: queryInterface.sequelize.QueryTypes.DELETE,
        replacements: ['f9c276c6-a160-42ca-bdd7-3786381eb0d0'],
        transaction,
      })
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
