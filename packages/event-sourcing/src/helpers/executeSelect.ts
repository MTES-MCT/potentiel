import { Client } from 'pg';
import { getConnectionString } from './getConnectionString';

export const executeSelect = async <TResult extends Record<string, unknown>>(
  query: string,
  ...values: unknown[]
): Promise<TResult[]> => {
  const client = new Client(getConnectionString());

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
