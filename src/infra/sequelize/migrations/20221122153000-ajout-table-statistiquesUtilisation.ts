import { QueryInterface, DataTypes, NOW } from 'sequelize'

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('statistiquesUtilisation', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: NOW,
      },
      données: {
        type: DataTypes.JSON,
        allowNull: false,
      },
    })
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('statistiquesUtilisation')
  },
}
