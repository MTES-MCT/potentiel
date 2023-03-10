import { Client } from 'pg';
import { Publish } from '../../core-domain/src/publish';

export const publishFactory =
  (): Publish =>
  async (streamId, ...events) => {
    const client = new Client(process.env.EVENT_STORE_CONNECTION_STRING);

    try {
      await client.connect();

      for (const { type, payload, createdAt } of events) {
        await client.query(
          `INSERT INTO "EVENT_STREAM" ("streamId", "createdAt", "type", "payload") VALUES ($1, $2, $3, $4)`,
          [streamId, createdAt, type, payload],
        );
      }
    } catch (error) {
      throw error;
      // TODO : faire un logger
    } finally {
      await client.end();
    }
  };
