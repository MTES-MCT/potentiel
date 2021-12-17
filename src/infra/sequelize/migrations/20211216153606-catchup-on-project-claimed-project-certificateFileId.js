'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      const projectClaimedEvents = await queryInterface.sequelize.query(
        `SELECT * FROM "eventStores" WHERE type = 'ProjectClaimed'`,
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction,
        }
      )

      for (const event of projectClaimedEvents) {
        const {
          payload: { projectId, attestationDesignationFileId },
        } = event

        const project = await queryInterface.sequelize.query(
          `SELECT "certificateFileId" FROM "projects" WHERE id = ?`,
          {
            type: queryInterface.sequelize.QueryTypes.SELECT,
            replacements: [projectId],
            transaction,
          }
        )

        if (project && !project.certificateFileId) {
          await queryInterface.sequelize.query(
            'UPDATE "projects" SET "certificateFileId" = ? WHERE id = ?',
            {
              type: queryInterface.sequelize.UPDATE,
              replacements: [attestationDesignationFileId, projectId],
              transaction,
            }
          )
        }
      }
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
