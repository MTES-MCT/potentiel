import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn('raccordements', 'codeEICGestionnaireRéseau', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('raccordements', 'codeEICGestionnaireRéseau');
  },
};
