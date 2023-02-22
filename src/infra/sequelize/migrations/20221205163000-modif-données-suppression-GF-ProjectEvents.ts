import { ProjectEvent } from '../projectionsNext/projectEvents/projectEvent.model';

export default {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await ProjectEvent.destroy({ where: { type: 'GarantiesFinancières' }, transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
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
};
