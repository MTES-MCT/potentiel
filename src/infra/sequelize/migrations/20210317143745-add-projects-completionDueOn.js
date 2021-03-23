'use strict'

const moment = require('moment')
const uuid = require('uuid')

const dureeRealisationByAppelOffre = {
  Fessenheim: 24,
  Eolien: 36,
  'CRE4 - Bâtiment': 20,
  'CRE4 - Autoconsommation ZNI': 30,
  'CRE4 - Autoconsommation métropole': 24,
  'CRE4 - ZNI': 24,
  'CRE4 - Sol': 24,
  'CRE4 - Innovation': 24,
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.addColumn('projects', 'completionDueOn', {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        transaction,
      })

      const notifiedProjects = await queryInterface.sequelize.query(
        'SELECT * FROM "projects" WHERE "notifiedOn"!=0 AND "classe"=\'Classé\'',
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction,
        }
      )

      for (const project of notifiedProjects) {
        const dureeRealisation = dureeRealisationByAppelOffre[project.appelOffreId]
        if (!dureeRealisation) {
          console.error(
            `Impossible de trouver la duree de réalisation pour le projet ${project.id} avec appelOffreId ${project.appelOffreId}`
          )
          continue
        }
        const completionDueOn = moment(project.notifiedOn)
          .add(dureeRealisation, 'months')
          .toDate()
          .getTime()
        // Update project.completionDueOn for each project
        await queryInterface.sequelize.query(
          'UPDATE "projects" SET "completionDueOn" = ? WHERE "id" = ?',
          {
            type: queryInterface.sequelize.QueryTypes.SELECT,
            replacements: [completionDueOn, project.id],
            transaction,
          }
        )
        // Create an original looking "ProjectCompletionDueDateSet" event
        await queryInterface.bulkInsert(
          'eventStores',
          [
            {
              id: uuid.v4(),
              type: 'ProjectCompletionDueDateSet',
              payload: JSON.stringify({
                projectId: project.id,
                completionDueOn,
              }),
              version: 1,
              aggregateId: project.id,
              occurredAt: new Date(project.notifiedOn),
              createdAt: new Date(project.notifiedOn),
              updatedAt: new Date(project.notifiedOn),
            },
          ],
          { transaction }
        )
      }

      console.log(`Updated completionDueOn for ${notifiedProjects.length} projects`)

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('projects', 'completionDueOn')
  },
}
