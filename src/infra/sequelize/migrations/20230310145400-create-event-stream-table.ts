import { QueryInterface } from 'sequelize';
export default {
  up: (queryInterface: QueryInterface) =>
    queryInterface.sequelize.query(`
      CREATE TABLE "EVENT_STREAM" (
        "streamId" VARCHAR NOT NULL,
        "createdAt" VARCHAR NOT NULL,
        "type" VARCHAR NOT NULL,
        "payload" JSONB,
        PRIMARY KEY ("streamId", "createdAt")
      );

      CREATE INDEX ON "EVENT_STREAM" ("streamId");
    `),

  down: async () => {},
};
