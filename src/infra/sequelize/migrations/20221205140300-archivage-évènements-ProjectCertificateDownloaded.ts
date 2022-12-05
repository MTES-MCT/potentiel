import { QueryInterface } from 'sequelize'
import { models } from '../models'

module.exports = {
  async up(queryInterface: QueryInterface) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      const { EventStore } = models

      await EventStore.destroy(
        {
          where: {
            type: 'ProjectCertificateDownloaded',
          },
        },
        { transaction }
      )

      await transaction.commit()
    } catch (e) {
      console.error(e)
      await transaction.rollback()
    }
  },

  async down(queryInterface: QueryInterface) {},
}
