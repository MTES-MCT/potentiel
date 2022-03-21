'use strict'

const { models } = require('../models')
const { fromPersistance } = require('../helpers/fromPersistance')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const projectIdToRebuild = 'ed3ccfda-fb6f-4410-b040-ac325abadc94'
    const transaction = await queryInterface.sequelize.transaction()

    try {
      const events = await queryInterface.sequelize.query(
        `SELECT * FROM "eventStores" WHERE "aggregateId" && ? ORDER BY "occurredAt" ASC`,
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          replacements: [`{${projectIdToRebuild}}`],
          transaction,
        }
      )

      if (events && events.length) {
        const importedEvent = fromPersistance(
          events.filter((e) => e.type === 'ProjectImported').pop()
        )
        const { projectId, data, potentielIdentifier } = importedEvent.payload
        const importedProject = {
          id: projectId,
          ...data,
          potentielIdentifier,
        }

        const eventsWithoutImported = events
          .filter((e) => e.type !== 'ProjectImported')
          .map(fromPersistance)

        const projectToUpdate = eventsWithoutImported.reduce((project, event) => {
          switch (event.type) {
            case 'ProjectNotificationDateSet':
              return {
                ...project,
                notifiedOn: event.payload.notifiedOn,
              }
            case 'ProjectDCRDueDateSet':
              return {
                ...project,
                dcrDueOn: event.payload.dcrDueOn,
              }
            case 'ProjectGFDueDateSet':
              return {
                ...project,
                garantiesFinancieresDueOn: event.payload.garantiesFinancieresDueOn,
              }
            case 'ProjectCompletionDueDateSet':
              return {
                ...project,
                completionDueOn: event.payload.completionDueOn,
              }
          }
        }, importedProject)

        const { Project } = models
        await Project.update(projectToUpdate, { where: { id: projectId } }, { transaction })
      }

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
