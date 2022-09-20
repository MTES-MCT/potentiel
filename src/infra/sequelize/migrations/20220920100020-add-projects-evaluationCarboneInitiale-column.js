'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('projects', 'evaluationCarboneInitiale', {
      type: Sequelize.DataTypes.DOUBLE,
      allowNull: true,
    })
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('projects', 'evaluationCarboneInitiale')
  },
}
