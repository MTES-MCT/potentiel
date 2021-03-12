'use strict'
const uuid = require('uuid')

function GFEventToStep({ occurredAt, payload: { projectId, gfDate, fileId, submittedBy } }) {
  return {
    id: uuid.v4(),
    type: 'garantie-financiere',
    projectId,
    stepDate: gfDate,
    fileId,
    submittedOn: occurredAt,
    submittedBy,
  }
}

function DCREventToStep({
  occurredAt,
  payload: { projectId, dcrDate, fileId, submittedBy, numeroDossier },
}) {
  return {
    id: uuid.v4(),
    type: 'dcr',
    projectId,
    stepDate: dcrDate,
    fileId,
    submittedOn: occurredAt,
    submittedBy,
    details: JSON.stringify({ numeroDossier }),
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      // Create project_steps from the events in the event store

      const GFEvents = await queryInterface.sequelize.query(
        'SELECT * FROM "eventStores" WHERE type = ? OR type = ? ORDER BY "occurredAt" ASC',
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          replacements: ['ProjectGFSubmitted', 'ProjectGFRemoved'],
          transaction,
        }
      )

      for (const GFEvent of GFEvents) {
        // No matter if it's a submission or a removal, start by removing any old gf step
        await queryInterface.bulkDelete(
          'project_steps',
          { type: 'garantie-financiere', projectId: GFEvent.payload.projectId },
          { transaction }
        )

        if (GFEvent.type === 'ProjectGFSubmitted') {
          await queryInterface.bulkInsert('project_steps', [GFEventToStep(GFEvent)], {
            transaction,
          })
        }
      }

      const DCREvents = await queryInterface.sequelize.query(
        'SELECT * FROM "eventStores" WHERE type = ? OR type = ? ORDER BY "occurredAt" ASC',
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          replacements: ['ProjectDCRSubmitted', 'ProjectDCRRemoved'],
          transaction,
        }
      )

      for (const DCREvent of DCREvents) {
        // No matter if it's a submission or a removal, start by removing any old dcr step
        await queryInterface.bulkDelete(
          'project_steps',
          { type: 'dcr', projectId: DCREvent.payload.projectId },
          { transaction }
        )

        if (DCREvent.type === 'ProjectDCRSubmitted') {
          await queryInterface.bulkInsert('project_steps', [DCREventToStep(DCREvent)], {
            transaction,
          })
        }
      }

      await transaction.commit()

      // Remove deprecated columns

      await queryInterface.removeColumn('projects', 'garantiesFinancieresSubmittedOn')
      await queryInterface.removeColumn('projects', 'garantiesFinancieresDate')
      await queryInterface.removeColumn('projects', 'garantiesFinancieresFile')
      await queryInterface.removeColumn('projects', 'garantiesFinancieresSubmittedBy')
      await queryInterface.removeColumn('projects', 'dcrSubmittedOn')
      await queryInterface.removeColumn('projects', 'dcrDate')
      await queryInterface.removeColumn('projects', 'dcrFile')
      await queryInterface.removeColumn('projects', 'dcrNumeroDossier')
      await queryInterface.removeColumn('projects', 'dcrSubmittedBy')
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
