'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.changeColumn('projects', 'adresseProjet', {
        type: Sequelize.DataTypes.TEXT,
        transaction,
      })

      await transaction.commit()
    } catch (err) {
      console.log('err', err)
      await transaction.rollback()
      throw err
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
}
