'use strict'

import { QueryInterface, Sequelize } from 'sequelize'
import { logger } from '@core/utils'
import { ProjectGFDueDateSet } from '@modules/project'
import { toPersistance } from '../helpers'
import { ProjectEvent } from '../projectionsNext'
import models from '../models'
import { UniqueEntityID } from '@core/domain'

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      const { Project, EventStore } = models
      const projetsZNI2017 = await Project.findAll(
        {
          where: {
            appelOffreId: 'CRE4 - ZNI 2017',
            garantiesFinancieresDueOn: 0,
            garantiesFinancieresFileId: null,
          },
          attributes: ['dcrDueOn', 'id'],
        },
        { transaction }
      )

      if (!projetsZNI2017.length) {
        logger.error(`aucun projet trouvé avec l'AO CRE4 - ZNI 2017`)
      } else {
        let countProjectsUpdated = 0
        for (const project of projetsZNI2017) {
          const { id: projectId, dcrDueOn } = project

          await Project.update(
            { garantiesFinancieresDueOn: dcrDueOn },
            { where: { id: projectId }, transaction }
          )

          await ProjectEvent.create(
            {
              projectId,
              type: ProjectGFDueDateSet.type,
              eventPublishedAt: dcrDueOn,
              valueDate: dcrDueOn,
              id: new UniqueEntityID().toString(),
            },
            { transaction }
          )

          await EventStore.create(
            toPersistance(
              new ProjectGFDueDateSet({
                payload: { projectId, garantiesFinancieresDueOn: dcrDueOn },
              })
            ),
            { transaction }
          )

          countProjectsUpdated++
        }
        console.log(`${countProjectsUpdated} projets ont été modifiés`)
      }
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
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
