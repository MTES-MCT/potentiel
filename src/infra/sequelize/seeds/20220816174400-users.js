'use strict'

const uuid = require('uuid')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    try {
      const drealUserId = '5c3c3cd0-95f1-11ea-b350-bb5aa5faa992'
      const users = [
        {
          id: '5c3bc7a0-95f1-11ea-b350-bb5aa5faa993',
          fullName: 'Admin Test',
          email: 'admin@test.test',
          role: 'admin',
        },
        {
          id: drealUserId,
          fullName: 'Dreal Test',
          email: 'dreal@test.test',
          role: 'dreal',
        },
        {
          id: '5c3c3cd4-95f1-11ea-b350-bb5aa5faa994',
          fullName: 'Porteur Projet Test',
          email: 'porteur@test.test',
          role: 'porteur-projet',
        },
        {
          id: '5c3c3cd4-95f1-11ea-b350-bb5aa5faa995',
          fullName: 'Ademe Test',
          email: 'ademe@test.test',
          role: 'ademe',
        },
        {
          id: '5c3c3cd4-95f1-11ea-b350-bb5aa5faa996',
          fullName: 'Acheteur obligé Test',
          email: 'ao@test.test',
          role: 'acheteur-obligé',
        },
        {
          id: '5c3c3cd4-95f1-11ea-b350-bb5aa5faa997',
          fullName: 'DGEC validateur Test',
          email: 'dgec-validateur@test.test',
          fonction: 'Intitulé de la fonction du DGEC validateur test',
          role: 'dgec-validateur',
        },
        {
          id: '5c3c3cd4-95f1-11ea-b350-bb5aa5faa998',
          fullName: 'CRE',
          email: 'cre@test.test',
          fonction: 'Intitulé de la fonction du CRE',
          role: 'cre',
        },
        {
          id: '5c3c3cd4-95f1-11ea-b350-bb5aa5faa999',
          fullName: 'Caisse des dépôts test',
          email: 'caissedesdepots@test.test',
          role: 'caisse-des-dépôts',
        },
      ]

      await queryInterface.bulkInsert(
        'users',
        users.map(({ id, fullName, email, role, fonction }) => ({
          id,
          fullName,
          email,
          role,
          createdAt: new Date(),
          updatedAt: new Date(),
          fonction,
        })),
        {}
      )

      await queryInterface.bulkInsert(
        'eventStores',
        users.map(({ id, fullName, email, role }) => ({
          id: uuid.v4(),
          type: 'UserCreated',
          payload: JSON.stringify({
            userId: id,
            email,
            role,
            fullName,
          }),
          version: 1,
          aggregateId: [id],
          occurredAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
      )

      await queryInterface.bulkInsert('userDreals', [
        {
          userId: drealUserId,
          dreal: 'Île-de-France',
        },
      ])
    } catch (error) {
      console.error(error)
    }
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
}
