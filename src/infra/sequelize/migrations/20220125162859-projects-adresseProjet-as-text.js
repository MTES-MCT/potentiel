'use strict'
const { models } = require('../models')
const { fromPersistance } = require('../helpers/fromPersistance')
const { onProjectImported } = require('../projections/project/updates/onProjectImported')
const {
  onProjectNotificationDateSet,
} = require('../projections/project/updates/onProjectNotificationDateSet')
const { onProjectDCRDueDateSet } = require('../projections/project/updates/onProjectDCRDueDateSet')
const { onProjectGFDueDateSet } = require('../projections/project/updates/onProjectGFDueDateSet')
const {
  onProjectCompletionDueDateSet,
} = require('../projections/project/updates/onProjectCompletionDueDateSet')

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
