'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.sequelize.transaction((t) =>
      queryInterface.sequelize
        .query(
          `
          DROP TRIGGER projects_vector_update ON projects;
        `,
          { transaction: t }
        )
        .then(() =>
          queryInterface.sequelize.query(
            `
                DROP INDEX projects_search;
              `,
            { transaction: t }
          )
        )
        .then(() =>
          queryInterface.sequelize.query(
            `
                ALTER TABLE projects DROP COLUMN _search;
              `,
            { transaction: t }
          )
        )
    )
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
}
