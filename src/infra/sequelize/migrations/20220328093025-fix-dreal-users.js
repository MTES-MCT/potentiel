'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.sequelize.query(
        `UPDATE "users" 
         SET role = 'dreal'
         WHERE "id" IN (
           '186dbf1e-fbb1-4f91-809b-1e8215aecbc9', 
           '25d0ee79-c98b-40c8-b4a5-ea71ac8d3875', 
           '9d713c5b-3bd5-4008-a8f3-1f18ff808305',
           '46e5893d-0441-4226-99eb-2ca51812f32a')`,
        {
          type: queryInterface.sequelize.QueryTypes.UPDATE,
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
