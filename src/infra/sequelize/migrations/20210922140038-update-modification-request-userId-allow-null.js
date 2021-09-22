'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.renameColumn('modificationRequests', 'userId', 'oldUserId', {
        transaction,
      })
      await queryInterface.addColumn(
        'modificationRequests',
        'userId',
        { type: Sequelize.DataTypes.UUID, allowNull: true },
        {
          transaction,
        }
      )

      await queryInterface.sequelize.query(
        'UPDATE "modificationRequests" SET "userId" = "oldUserId"',
        {
          transaction,
        }
      )

      await queryInterface.removeColumn('modificationRequests', 'oldUserId', {
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
