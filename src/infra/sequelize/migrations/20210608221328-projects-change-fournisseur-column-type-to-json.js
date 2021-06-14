'use strict'

module.exports = {
  up: async (queryInterface, { DataTypes }) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.renameColumn('modificationRequests', 'fournisseur', 'oldFournisseur', {
        transaction,
      })

      await queryInterface.addColumn(
        'modificationRequests',
        'fournisseurs',
        { type: DataTypes.JSON, allowNull: true },
        {
          transaction,
        }
      )

      await queryInterface.removeColumn('modificationRequests', 'oldFournisseur', {
        transaction,
      })

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },

  down: async (queryInterface, Sequelize) => {},
}
