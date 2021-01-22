'use strict'

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
      await queryInterface.bulkInsert(
        'users',
        [
          {
            id: '5c3bc7a0-95f1-11ea-b350-bb5aa5faa992',
            fullName: 'Admin Test',
            email: 'admin@test.test',
            role: 'admin',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '5c3c3cd0-95f1-11ea-b350-bb5aa5faa992',
            fullName: 'Dreal Test',
            email: 'dreal@test.test',
            role: 'dreal',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '5c3c3cd4-95f1-11ea-b350-bb5aa5faa992',
            fullName: 'Porteur Projet Test',
            email: 'porteur@test.test',
            role: 'porteur-projet',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        {}
      )

      await queryInterface.bulkInsert(
        'credentials',
        [
          {
            id: '5c3c15c0-95f1-11ea-b350-bb5aa5faa992',
            userId: '5c3bc7a0-95f1-11ea-b350-bb5aa5faa992',
            email: 'admin@test.test',
            hash: '098f6bcd4621d373cade4e832627b4f6',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '5c3c3cd1-95f1-11ea-b350-bb5aa5faa992',
            userId: '5c3c3cd0-95f1-11ea-b350-bb5aa5faa992',
            email: 'dreal@test.test',
            hash: '098f6bcd4621d373cade4e832627b4f6',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '5c3c3cd5-95f1-11ea-b350-bb5aa5faa992',
            userId: '5c3c3cd4-95f1-11ea-b350-bb5aa5faa992',
            email: 'porteur@test.test',
            hash: '098f6bcd4621d373cade4e832627b4f6',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        {}
      )
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

    await queryInterface.bulkDelete('users', {
      id: {
        [Sequelize.Op.in]: [
          '5c3bc7a0-95f1-11ea-b350-bb5aa5faa992',
          '5c3c3cd0-95f1-11ea-b350-bb5aa5faa992',
          '5c3c3cd4-95f1-11ea-b350-bb5aa5faa992',
        ],
      },
    })

    await queryInterface.bulkDelete('credentials', {
      id: {
        [Sequelize.Op.in]: [
          '5c3c15c0-95f1-11ea-b350-bb5aa5faa992',
          '5c3c3cd1-95f1-11ea-b350-bb5aa5faa992',
          '5c3c3cd5-95f1-11ea-b350-bb5aa5faa992',
        ],
      },
    })
  },
}
