import { Client } from 'pg';
import { Publish } from '../../core-domain/src/publish';

export const publishFactory =
  (): Publish =>
  async (aggregateId, ...events) => {
    const client = new Client(process.env.EVENT_STORE_CONNECTION_STRING);

    try {
      await client.connect();

      for (const [index, { type, payload, createdAt }] of events.entries()) {
        const eventId = `${createdAt}#${index}`;

        await client.query(
          `INSERT INTO "EVENT_STREAM" ("aggregateId", "eventId", "type", "payload") VALUES ($1, $2, $3, $4)`,
          [aggregateId, eventId, type, payload],
        );
      }
    } catch (error) {
      throw error;
      // TODO : faire un logger
    } finally {
      await client.end();
    }
  };
