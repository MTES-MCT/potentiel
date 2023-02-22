import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn('projects', 'soumisAuxGF', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down(queryInterface: QueryInterface) {
    queryInterface.removeColumn('projects', 'soumisAuxGF');
  },
};
