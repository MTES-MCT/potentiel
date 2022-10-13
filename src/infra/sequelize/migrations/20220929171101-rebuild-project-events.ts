import { ProjectEventProjector } from '../projectionsNext'

export default {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await ProjectEventProjector.rebuild(transaction)

      await transaction.commit()
    } catch (error) {
      console.log(error, error.message)
      await transaction.rollback()
      throw error
    }
  },

  down: async () => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
}
