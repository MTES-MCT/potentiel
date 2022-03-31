'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.sequelize.query(
        `DELETE FROM "userDreals" 
         WHERE "userId" = '186dbf1e-fbb1-4f91-809b-1e8215aecbc9'
         AND dreal = 'Auvergne-Rhône-Alpes'`,
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
