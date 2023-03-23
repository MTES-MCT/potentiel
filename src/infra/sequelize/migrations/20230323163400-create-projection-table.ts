import { QueryInterface } from 'sequelize';
export default {
  up: (queryInterface: QueryInterface) =>
    queryInterface.sequelize.query(`
      CREATE TABLE "PROJECTION" (
        "key" VARCHAR PRIMARY KEY,
        "value" JSONB NOT NULL
      );
    `),

  down: async () => {},
};
