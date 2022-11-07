import { TâchesProjector } from '@infra/sequelize'
import { QueryInterface } from 'sequelize'

export default {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await TâchesProjector.rebuild(transaction)

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  down: async () => {},
}
