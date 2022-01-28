'use strict'
const { models } = require('../models')
const { fromPersistance } = require('../helpers/fromPersistance')
const { onProjectImported } = require('../projections/project/updates/onProjectImported')
const {
  onProjectNotificationDateSet,
} = require('../projections/project/updates/onProjectNotificationDateSet')
const { onProjectDCRDueDateSet } = require('../projections/project/updates/onProjectDCRDueDateSet')
const { onProjectGFDueDateSet } = require('../projections/project/updates/onProjectGFDueDateSet')
const {
  onProjectCompletionDueDateSet,
} = require('../projections/project/updates/onProjectCompletionDueDateSet')

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const projectIds = [
        '0d78c388-b723-4485-b190-611f53d779f2',
        '9c6b0c33-1963-4d76-a101-a3ee86c70aa8',
        '04864102-436e-423f-8a1a-8b9be7d82b52',
      ]

      const projections = [
        ['ProjectImported', onProjectImported],
        ['ProjectNotificationDateSet', onProjectNotificationDateSet],
        ['ProjectDCRDueDateSet', onProjectDCRDueDateSet],
        ['ProjectGFDueDateSet', onProjectGFDueDateSet],
        ['ProjectCompletionDueDateSet', onProjectCompletionDueDateSet],
      ]

      for (const projectId of projectIds) {
        for (const [eventType, projector] of projections) {
          const eventsFromDb = await queryInterface.sequelize.query(
            'SELECT * FROM "eventStores" WHERE type = ? AND "aggregateId" && ?',
            {
              type: queryInterface.sequelize.QueryTypes.SELECT,
              replacements: [eventType, `{${projectId}}`],
            }
          )

          if (eventsFromDb.length === 0) {
            throw `Impossble de trouver l'événement de type ${eventType} pour le projet ${projectId}`
          }

          await projector(models)(fromPersistance(eventsFromDb[0]))
        }
      }
    } catch (err) {
      throw err
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
}
