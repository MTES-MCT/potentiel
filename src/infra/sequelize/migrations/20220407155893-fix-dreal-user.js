'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.sequelize.query(
        `UPDATE "users" 
         SET role = 'dreal'
         WHERE "id" = '4181f87d-2ac2-4b00-bcf7-272e9a6bae4b'`,
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
