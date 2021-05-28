'use strict';
const uuid = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      const modificationRequests = await queryInterface.sequelize.query(
        'SELECT * FROM "modificationRequests" WHERE "createdAt" < \'2021-02-01\'::date;',
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction,
        }
      )

      modificationRequests.length && await queryInterface.bulkInsert(
        'eventStores',
        modificationRequests.map(({
            type,
            id,
            projectId,
            fileId,
            userId,
            justification,
            actionnaire,
            producteur,
            fournisseur,
            puissance,
            evaluationCarbone,
            delayInMonths,
            requestedOn
        }) => ({
          id: uuid.v4(),
          type: 'ModificationRequested',
          payload: JSON.stringify({
            type,
            modificationRequestId: id,
            projectId,
            requestedBy: userId,
            fileId,
            justification,
            actionnaire,
            producteur,
            fournisseur,
            puissance,
            evaluationCarbone,
            delayInMonths
          }),
          version: 1,
          aggregateId: [id],
          occurredAt: new Date(requestedOn),
          createdAt: new Date(requestedOn),
          updatedAt: new Date(requestedOn),
        }))
        ,
        { transaction }
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
  }
};
