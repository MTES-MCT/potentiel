import { Client } from 'pg';

export const loadFromStreamFactory = () => async (streamId: string) => {
  const client = new Client(process.env.EVENT_STORE_CONNECTION_STRING);

  try {
    await client.connect();

    const result = await client.query<{
      streamId: string;
      createdAt: string;
      type: string;
      payload: Record<string, unknown>;
    }>(
      `SELECT "streamId", "createdAt", "type", "payload" FROM "EVENT_STREAM" where "streamId" = $1`,
      [streamId],
    );

    return result.rows.map(({ createdAt, type, payload }) => ({ createdAt, type, payload }));
  } catch (error) {
    throw error;
    // TODO : faire un logger
  } finally {
    await client.end();
  }
};
