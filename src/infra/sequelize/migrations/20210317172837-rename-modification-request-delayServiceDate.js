'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.addColumn(
        'modificationRequests',
        'delayInMonths',
        {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
        },
        { transaction }
      )

      const delayRequests = await queryInterface.sequelize.query(
        'SELECT * FROM "modificationRequests" WHERE "type"=\'delai\';',
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction,
        }
      )

      for (const delayRequest of delayRequests) {
        await queryInterface.sequelize.query(
          'UPDATE "modificationRequests" SET "delayInMonths" = ? WHERE "id" = ?',
          {
            type: queryInterface.sequelize.QueryTypes.SELECT,
            replacements: [2, delayRequest.id],
            transaction,
          }
        )

        const newPayload = {
          type: 'delai',
          modificationRequestId: delayRequest.id,
          projectId: delayRequest.projectId,
          requestedBy: delayRequest.userId,
          fileId: delayRequest.fileId,
          justification: delayRequest.justification,
          delayInMonths: 2,
        }

        await queryInterface.sequelize.query(
          'UPDATE "eventStores" SET "payload" = ? WHERE "aggregateId" = ?',
          {
            type: queryInterface.sequelize.QueryTypes.SELECT,
            replacements: [JSON.stringify(newPayload), delayRequest.id],
            transaction,
          }
        )
        console.log(`Updated delay modification request ${delayRequest.id}`)
      }

      await queryInterface.removeColumn('modificationRequests', 'delayedServiceDate', {
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
