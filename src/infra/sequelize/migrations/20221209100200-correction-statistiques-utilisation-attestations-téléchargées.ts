import { QueryInterface } from 'sequelize';
import { StatistiquesUtilisation } from '../tableModels';

module.exports = {
  async up(queryInterface: QueryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await StatistiquesUtilisation.update(
        { type: 'attestationTéléchargée' },
        {
          where: { type: 'AttestationTéléchargée' },
          transaction,
        },
      );

      await transaction.commit();
    } catch (e) {
      console.error(e);
      await transaction.rollback();
    }
  },

  async down(queryInterface: QueryInterface) {},
};
