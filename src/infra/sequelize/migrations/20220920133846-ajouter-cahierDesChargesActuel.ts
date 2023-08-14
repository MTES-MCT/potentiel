import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn('projects', 'cahierDesChargesActuel', {
      type: DataTypes.ENUM(
        'initial',
        '30/07/2021',
        '30/08/2022',
        '30/08/2022-alternatif',
        '07/02/2023',
        '07/02/2023-alternatif',
      ),
      allowNull: false,
      defaultValue: 'initial',
    });
  },

  down: async (queryInterface) => {
    queryInterface.removeColumn('users', 'fonction');
  },
};
