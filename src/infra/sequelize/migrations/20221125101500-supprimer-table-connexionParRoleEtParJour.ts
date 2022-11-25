import { QueryInterface } from 'sequelize'

module.exports = {
  async up(queryInterface: QueryInterface) {
    try {
      await queryInterface.dropTable('connexionsParRoleEtParJour')
    } catch (e) {
      console.error(e)
    }
  },

  async down(queryInterface: QueryInterface) {},
}
