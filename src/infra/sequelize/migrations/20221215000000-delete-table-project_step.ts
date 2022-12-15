import { QueryInterface } from 'sequelize'

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.dropTable('project_steps')
  },

  async down(queryInterface: QueryInterface) {},
}
