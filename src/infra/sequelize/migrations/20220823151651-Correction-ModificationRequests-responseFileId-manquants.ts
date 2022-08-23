'use strict'

import models from '../models'

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      const { EventStore, ModificationRequest } = models
      const événementsDesDemandesACorriger = await EventStore.findAll(
        { where: { type: 'DélaiRejeté' } },
        { transaction }
      )

      événementsDesDemandesACorriger.map(async ({ payload }) => {
        await ModificationRequest.update(
          {
            responseFileId: payload.fichierRéponseId,
          },
          {
            where: { id: payload.demandeDélaiId },
          },
          { transaction }
        )
      })

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async down(queryInterface, Sequelize) {},
}
