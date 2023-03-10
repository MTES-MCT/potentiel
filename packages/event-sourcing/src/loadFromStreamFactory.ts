import { Client } from 'pg';
import { executeSelect } from './helpers/executeSelect';

export const loadFromStreamFactory = () => async (streamId: string) => {
  const client = new Client(process.env.EVENT_STORE_CONNECTION_STRING);

  try {
    await client.connect();

    const result = await executeSelect<{
      streamId: string;
      createdAt: string;
      type: string;
      payload: Record<string, unknown>;
    }>(
      `SELECT "streamId", "createdAt", "type", "payload" FROM "EVENT_STREAM" where "streamId" = $1`,
      streamId,
    );

    return result.map(({ createdAt, type, payload }) => ({ createdAt, type, payload }));
  } catch (error) {
    throw error;
    // TODO : faire un logger
  } finally {
    await client.end();
  }
};
