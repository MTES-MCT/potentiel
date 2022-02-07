'use strict'

const {
  UserRightsToProjectRevoked,
} = require('../../../modules/authZ/events/UserRightsToProjectRevoked')
const { toPersistance } = require('../helpers/toPersistance')

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Le 01/12/21, suite à un import de données erronnées pour la période Batiment 13,
     * des utilisateurs ont reçu des droits sur les mauvais projets.
     * Dans l'urgence, les droits erronnés ont été retirés en faisant une requête
     * directement dans la projection `UserProjects`.
     * Ce script ajoute des événements de type UserRightsToProjectRevoked
     * pour que l'historique corresponde bien aux droits.
     */

    const wrongUserRightsToProjectGranted = await queryInterface.sequelize.query(
      `SELECT * FROM "eventStores" WHERE type = 'UserRightsToProjectGranted' AND "occurredAt" >= '2021-12-01' and "occurredAt" < '2021-12-02'`,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    )

    const rightsToRevokeFromUserRightsToProjectGranted = wrongUserRightsToProjectGranted.map(
      ({ payload: { projectId, userId } }) => ({
        projectId,
        userId,
        origin: 'UserRightsToProjectGranted',
      })
    )

    const wrongUserProjectsLinkedByContactEmail = await queryInterface.sequelize.query(
      `SELECT * FROM "eventStores" WHERE type = 'UserProjectsLinkedByContactEmail' AND "occurredAt" >= '2021-12-01' and "occurredAt" < '2021-12-02'`,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    )

    const rightsToRevokeFromUserProjectsLinkedByContactEmail =
      wrongUserProjectsLinkedByContactEmail.reduce(
        (arr, { payload }) => [
          ...arr,
          ...payload.projectIds.map((projectId) => ({
            projectId,
            userId: payload.userId,
            origin: 'UserProjectsLinkedByContactEmail',
          })),
        ],
        []
      )

    const rightsToRevoke = [
      ...rightsToRevokeFromUserRightsToProjectGranted,
      ...rightsToRevokeFromUserProjectsLinkedByContactEmail,
    ]

    if (!rightsToRevoke.length) return

    console.log('Inserting ' + rightsToRevoke.length + ' UserRightsToProjectRevoked events')

    await queryInterface.bulkInsert(
      'eventStores',
      rightsToRevoke
        .map(
          ({ projectId, userId }) =>
            new UserRightsToProjectRevoked({
              payload: { projectId, userId, revokedBy: '' },
              original: { version: 1, occurredAt: new Date('2021-12-02 17:35') },
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
