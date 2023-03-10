import { Publish } from '../../core-domain/src/publish';
import { executeQuery } from './helpers/executeQuery';

export const publishFactory =
  (): Publish =>
  async (streamId, ...events) => {
    for (const { type, payload, createdAt } of events) {
      await executeQuery(
        `INSERT INTO "EVENT_STREAM" ("streamId", "createdAt", "type", "payload") VALUES ($1, $2, $3, $4)`,
        streamId,
        createdAt,
        type,
        payload,
      );
    }
  };
