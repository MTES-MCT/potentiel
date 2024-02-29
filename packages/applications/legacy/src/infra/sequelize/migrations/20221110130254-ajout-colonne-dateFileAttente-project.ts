import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn('projects', 'dateFileAttente', {
      type: DataTypes.DATE,
      allowNull: true,
    });
  },

  async down() {},
};
