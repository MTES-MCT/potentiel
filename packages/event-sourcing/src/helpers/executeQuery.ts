import { Client } from 'pg';

export const executeQuery = async (query: string, ...values: unknown[]) => {
  const client = new Client(process.env.EVENT_STORE_CONNECTION_STRING);

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
