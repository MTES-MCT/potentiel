'use strict';

const crypto = require('crypto')

const makeProjectIdentifier = (project) => {
  const nakedIdentifier =
    project.appelOffreId.replace(/ /g, '') +
    '-P' +
    project.periodeId +
    (project.familleId ? '-F' + project.familleId : '') +
    '-' +
    project.numeroCRE

  return (
    nakedIdentifier +
    '-' +
    crypto.createHash('md5').update(project.id).digest('hex').substring(0, 3).toUpperCase()
  )
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = queryInterface.sequelize.transaction()
    try {
      const projectImportedEvents = await queryInterface.sequelize.query(
        'SELECT * FROM "eventStores" WHERE type = ?',
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          replacements: ['ProjectImported'],
          transaction,
        }
      )
      for(const event of projectImportedEvents) {
        const { id, payload } = event
        const potentielIdentifier = makeProjectIdentifier(payload)
        payload.potentielIdentifier = potentielIdentifier
        await queryInterface.sequelize.query(
          'UPDATE "eventStores" SET payload = ? WHERE id = ?',
          {
            type: queryInterface.sequelize.UPDATE,
            replacements: [JSON.stringify(payload), id],
            transaction,
          }
        ) 
      }
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {}
};
