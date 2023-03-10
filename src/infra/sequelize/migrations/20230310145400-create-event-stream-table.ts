import { QueryInterface } from 'sequelize';
export default {
  up: (queryInterface: QueryInterface) =>
    queryInterface.sequelize.query(`
      CREATE TABLE "EVENT_STREAM" (
        "streamId" VARCHAR NOT NULL,
        "eventId" VARCHAR NOT NULL,
        "type" VARCHAR NOT NULL,
        "payload" JSONB,
        PRIMARY KEY ("streamId", "eventId")
      );

      CREATE INDEX ON "EVENT_STREAM" ("streamId");
    `),

  down: async () => {},
};
