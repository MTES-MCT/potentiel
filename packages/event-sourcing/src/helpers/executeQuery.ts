import { Client } from 'pg';
import { getConnectionString } from './getConnectionString';

export const executeQuery = async (query: string, ...values: unknown[]) => {
  const client = new Client(getConnectionString());

  try {
    await client.connect();

    await client.query(query, values);
  } catch (error) {
    throw error;
    // TODO : faire un logger
  } finally {
    await client.end();
  }
};
