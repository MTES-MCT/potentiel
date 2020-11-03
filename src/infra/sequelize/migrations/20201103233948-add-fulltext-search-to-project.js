module.exports = {
  up: (queryInterface) =>
    queryInterface.sequelize.transaction((t) =>
      queryInterface.sequelize
        .query(`ALTER TABLE projects ADD COLUMN _search TSVECTOR;`, { transaction: t })
        .then(() => {
          queryInterface.sequelize.query(
            `UPDATE projects SET _search = to_tsvector('french', "nomCandidat" || ' ' || "nomProjet" || ' ' || "nomRepresentantLegal" || ' ' || "email" || ' ' || "adresseProjet" || ' ' || "codePostalProjet" || ' ' || "communeProjet" || ' ' || "departementProjet" || ' ' || "regionProjet" || ' ' || "numeroCRE");`,
            { transaction: t }
          )
        })
        .then(() =>
          queryInterface.sequelize.query(
            `CREATE INDEX projects_search ON projects USING gin(_search);`,
            { transaction: t }
          )
        )
        .then(() =>
          queryInterface.sequelize.query(
            `
                CREATE TRIGGER projects_vector_update
                BEFORE INSERT OR UPDATE ON projects
                FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger(_search, 'pg_catalog.french', "nomCandidat", "nomProjet", "nomRepresentantLegal", "email", "adresseProjet", "codePostalProjet", "communeProjet", "departementProjet", "regionProjet", "numeroCRE");
              `,
            { transaction: t }
          )
        )
        .error(console.error)
    ),

  down: (queryInterface) =>
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
    ),
}
