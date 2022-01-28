'use strict'

const {
  UserRightsToProjectGranted,
} = require('../../../modules/authZ/events/UserRightsToProjectGranted')
const { toPersistance } = require('../helpers/toPersistance')

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Le 02/12/21, suite à un import de données erronnées pour la période Batiment 13,
     * suite au retrait des droits de tous les utilisateurs de la période,
     * un ajout manuel de droits pour tous les PP de cette période a été fait
     * manuellement avec une requête sur UserProjects.
     * Ce script crée des événements UserRightsToProjectGranted pour rétablir l'historique
     */

    const rightFullProjectOwners = await queryInterface.sequelize.query(
      `SELECT projects.id as "projectId", users.id as "userId" from projects join users on projects.email = users.email where "projects"."appelOffreId"='CRE4 - Bâtiment' and "projects"."periodeId"='13' and "projects"."familleId"='2';`,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    )

    console.log('Inserting ' + rightFullProjectOwners.length + ' UserRightsToProjectGranted events')

    await queryInterface.bulkInsert(
      'eventStores',
      rightFullProjectOwners
        .map(
          ({ projectId, userId }) =>
            new UserRightsToProjectGranted({
              payload: { projectId, userId, grantedBy: '' },
              original: { version: 1, occurredAt: new Date('2021-12-02 11:00') },
            })
        )
        .map(toPersistance)
        .map((item) => ({ ...item, payload: JSON.stringify(item.payload) }))
    )
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
