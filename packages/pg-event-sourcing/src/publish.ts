import { Publish } from '../../core-domain/src/publish';
import { executeQuery } from './helpers/executeQuery';

export const publish: Publish = async (streamId, ...events) => {
  for (const { type, payload } of events) {
    const createdAt = new Date().toISOString();
    await executeQuery(
      `INSERT 
       INTO "EVENT_STREAM" (
        "streamId", 
        "createdAt", 
        "type", 
        "version", 
        "payload"
        ) 
       VALUES (
          $1, 
          $2, 
          $3, 
          (SELECT COUNT("streamId") + 1 FROM "EVENT_STREAM" WHERE "streamId" = $5), 
          $4
          )`,
      streamId,
      createdAt,
      type,
      payload,
      streamId,
    );
  }
};
