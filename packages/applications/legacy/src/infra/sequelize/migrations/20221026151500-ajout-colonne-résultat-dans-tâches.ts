export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('taches', 'résultat', {
      type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.JSON),
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    queryInterface.removeColumn('taches', 'résultat');
  },
};
