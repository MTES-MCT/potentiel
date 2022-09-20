'use strict'

import models from '../models'

const { EventStore, Project } = models

import { Op, QueryInterface } from 'sequelize'

module.exports = {
  async up(queryInterface: QueryInterface) {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      const projetsÀMigrer = await Project.findAll({}, { transaction })

      console.log(`${projetsÀMigrer.length} projets à migrer`)

      const importsEvents = await EventStore.findAll(
        {
          where: {
            type: {
              [Op.in]: ['ProjectImported', 'ProjectReimported', 'LegacyProjectSourced'],
            },
          },
          order: [['occurredAt', 'DESC']],
        },
        { transaction }
      )

      const evaluationCarboneInitialeMap = importsEvents.reduce((acc, event) => {
        const projetId = event.aggregateId[0]
        return {
          ...acc,
          [projetId]:
            acc[projetId] ??
            event.payload?.data?.evaluationCarbone ??
            event.payload?.content?.evaluationCarbone,
        }
      })

      await Project.bulkCreate(
        projetsÀMigrer.map((projet) => ({
          ...projet.get(),
          evaluationCarboneInitiale: evaluationCarboneInitialeMap[projet.id],
        })),
        { updateOnDuplicate: ['evaluationCarboneInitiale'], transaction }
      )

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async down(queryInterface) {},
}
