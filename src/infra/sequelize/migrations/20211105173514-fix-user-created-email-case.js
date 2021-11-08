'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      /**
       * Fix Users
       */

      await queryInterface.sequelize.query(
        'UPDATE "users" SET email = lower(email) WHERE email != lower(email)',
        {
          type: queryInterface.sequelize.UPDATE,
          replacements: [],
          transaction,
        }
      )

      /**
       * Fix UserCreated events
       */

      const UserCreatedWithWrongCaseEvents = await queryInterface.sequelize.query(
        `SELECT * FROM "eventStores" WHERE type = 'UserCreated' AND payload->>'email' != lower(payload->>'email')`,
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction,
        }
      )

      for (const event of UserCreatedWithWrongCaseEvents) {
        const { id, payload } = event

        // fix case
        payload.email = event.payload.email.toLowerCase()

        await queryInterface.sequelize.query('UPDATE "eventStores" SET payload = ? WHERE id = ?', {
          type: queryInterface.sequelize.UPDATE,
          replacements: [JSON.stringify(payload), id],
          transaction,
        })
      }

      /**
       * Fix projects
       */

      await queryInterface.sequelize.query(
        'UPDATE "projects" SET email = lower(email) WHERE email != lower(email)',
        {
          type: queryInterface.sequelize.UPDATE,
          replacements: [],
          transaction,
        }
      )

      /**
       * Fix ProjectImported events
       */

      const ProjectImportedWithWrongCaseEvents = await queryInterface.sequelize.query(
        `SELECT * FROM "eventStores" WHERE type = 'ProjectImported' AND cast(payload->'data'->'email' as text) != lower(cast(payload->'data'->'email' as text));`,
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction,
        }
      )

      for (const event of ProjectImportedWithWrongCaseEvents) {
        const { id, payload } = event

        // fix case
        payload.data.email = event.payload.data.email.toLowerCase()

        await queryInterface.sequelize.query('UPDATE "eventStores" SET payload = ? WHERE id = ?', {
          type: queryInterface.sequelize.UPDATE,
          replacements: [JSON.stringify(payload), id],
          transaction,
        })
      }

      /**
       * Fix ProjectReimported events
       */

      const ProjectReimportedWithWrongCaseEvents = await queryInterface.sequelize.query(
        `SELECT * FROM "eventStores" WHERE type = 'ProjectReimported' AND cast(payload->'data'->'email' as text) != lower(cast(payload->'data'->'email' as text));`,
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction,
        }
      )

      for (const event of ProjectReimportedWithWrongCaseEvents) {
        const { id, payload } = event

        // fix case
        payload.data.email = event.payload.data.email.toLowerCase()

        await queryInterface.sequelize.query('UPDATE "eventStores" SET payload = ? WHERE id = ?', {
          type: queryInterface.sequelize.UPDATE,
          replacements: [JSON.stringify(payload), id],
          transaction,
        })
      }

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },

  down: async (queryInterface, Sequelize) => {},
}
