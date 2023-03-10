import { Client } from 'pg';

export const executeSelect = async <TResult extends Record<string, unknown>>(
  query: string,
  ...values: unknown[]
): Promise<TResult[]> => {
  const client = new Client(process.env.EVENT_STORE_CONNECTION_STRING);

  try {
    await client.connect();

    const result = await client.query<TResult>(query, values);
    return result.rows;
  } catch (error) {
    throw error;
    // TODO : faire un logger
  } finally {
    await client.end();
  }
};
