'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.addColumn('modificationRequests', 'authority', {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        transaction,
      })

      await queryInterface.sequelize.query(
        `UPDATE "modificationRequests" SET "authority"='dreal' WHERE "type"!='abandon' AND "type"!='recours';`,
        {
          type: queryInterface.sequelize.QueryTypes.UPDATE,
          transaction,
        }
      )

      await queryInterface.sequelize.query(
        `UPDATE "modificationRequests" SET "authority"='dgec' WHERE "type"='abandon' OR "type"='recours';`,
        {
          type: queryInterface.sequelize.QueryTypes.UPDATE,
          transaction,
        }
      )

      const modificationEvents = await queryInterface.sequelize.query(
        `SELECT id, payload FROM "eventStores" WHERE "type"='ModificationRequested' OR "type"='ModificationReceived';`,
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction,
        }
      )

      for (const modificationEvent of modificationEvents) {
        const { payload, id } = modificationEvent
        if (payload.type === 'abandon' || payload.type === 'recours') {
          payload.authority = 'dgec'
        } else {
          payload.authority = 'dreal'
        }
        await queryInterface.sequelize.query(
          `UPDATE "eventStores" SET "payload" = ? WHERE "id" = ?;`,
          {
            type: queryInterface.sequelize.QueryTypes.SELECT,
            replacements: [JSON.stringify(payload), id],
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
    queryInterface.removeColumn('modificationRequests', 'authority')
  },
}
