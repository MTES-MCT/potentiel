import { QueryInterface } from 'sequelize';
export default {
  up: (queryInterface: QueryInterface) =>
    queryInterface.sequelize.query(`
      CREATE TABLE "EVENT_STREAM" (
        "streamId" VARCHAR NOT NULL,
        "createdAt" VARCHAR NOT NULL,
        "type" VARCHAR NOT NULL,
        "version" INTEGER NOT NULL,
        "payload" JSONB,
        PRIMARY KEY ("streamId", "createdAt", "version")
      );

      CREATE INDEX ON "EVENT_STREAM" ("streamId");

      CREATE FUNCTION notify_new_event() RETURNS TRIGGER AS
      $trigger$
        BEGIN
            PERFORM pg_notify('new_event', row_to_json(NEW)::text);
            RETURN NULL;
        END;
      $trigger$
        LANGUAGE plpgsql VOLATILE
        COST 100;

      CREATE TRIGGER notify_new_event
      AFTER INSERT
      ON "EVENT_STREAM"
      FOR EACH ROW
      EXECUTE PROCEDURE notify_new_event();
    `),

  down: async () => {},
};
