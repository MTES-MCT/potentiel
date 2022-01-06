'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('project_events')

    if (!tableDefinition.eventPublishedAt) {
      await queryInterface.addColumn('project_events', 'eventPublishedAt', {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
        default: 0,
      })
    }

    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.truncate(`TRUNCATE TABLE "project_events"`, {
        type: queryInterface.sequelize.QueryTypes.DELETE,
      })

      const projectEvents = await queryInterface.sequelize.query(
        `SELECT * FROM "eventStores" 
         WHERE type in ('ProjectClaimed', 
                        'ProjectNotified', 
                        'ProjectImported', 
                        'ProjectCertificateGenerated', 
                        'ProjectCertificateRegenerated', 
                        'ProjectCertificateUpdated',
                        'ProjectGFSubmitted') 
          ORDER BY "occurredAt" ASC`,
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction,
        }
      )

      await Promise.all(projectEvents.map((event) => ProjectEvent.projector.handleEvent(event)))

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
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
