import { QueryInterface, QueryTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      const deletedAt = new Date().toISOString();

      await queryInterface.sequelize.query(
        `UPDATE "eventStores" SET "deletedAt" = ? WHERE type = ?`,
        {
          type: QueryTypes.UPDATE,
          replacements: [deletedAt, 'LegacyUserCreated'],
          transaction,
        },
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async () => {},
};
