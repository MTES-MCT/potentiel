import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('taches', 'nombreDeSucces');
    await queryInterface.removeColumn('taches', 'nombreDEchecs');
    await queryInterface.removeColumn('taches', 'résultat');
    await queryInterface.addColumn('taches', 'résultat', {
      type: DataTypes.JSON,
      allowNull: true,
    });
  },

  down: async () => {},
};
