import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn('modificationRequests', 'délaiAccordéCorrigéLe', {
      type: DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn(
      'modificationRequests',
      'dateAchèvementAprèsCorrectionDélaiAccordé',
      {
        type: DataTypes.STRING,
        allowNull: true,
      },
    );
    await queryInterface.addColumn('modificationRequests', 'délaiAccordéCorrigéPar', {
      type: DataTypes.UUID,
      allowNull: true,
    });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('modificationRequests', 'délaiAccordéCorrigéLe');
    await queryInterface.removeColumn(
      'modificationRequests',
      'dateAchèvementAprèsCorrectionDélaiAccordé',
    );
    await queryInterface.removeColumn('modificationRequests', 'délaiAccordéCorrigéPar');
  },
};
