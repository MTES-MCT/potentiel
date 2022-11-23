'use strict'

import { getProjectAppelOffre } from '@config/queries.config'
import { QueryInterface, Sequelize } from 'sequelize'
import models from '../models'

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      const { Project } = models

      const projetsCible = await Project.findAll(
        {
          where: {
            classe: 'Classé',
          },
          attributes: ['id', 'appelOffreId', 'periodeId', 'familleId'],
        },
        {
          transaction,
        }
      )

      for (const { appelOffreId, periodeId, familleId, id } of projetsCible) {
        const appelOffre = getProjectAppelOffre({ appelOffreId, periodeId, familleId })

        if (!appelOffre?.isSoumisAuxGF) {
          return
        }

        await Project.update(
          {
            soumisAuxGF: true,
          },
          {
            where: {
              id,
            },
          },
          {
            transaction,
          }
        )
      }
      await transaction.commit()
    } catch (error) {
      console.error(error)
      await transaction.rollback()
      throw error
    }
  },

  async down() {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
}
