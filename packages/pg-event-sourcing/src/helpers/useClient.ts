import { Client, QueryResult } from 'pg';
import { getConnectionString } from './getConnectionString';

export const useClient = async <TResult extends Record<string, unknown>>(
  callback: (client: Client) => Promise<QueryResult<TResult>>,
) => {
  let client;

  try {
    client = new Client(getConnectionString());
    await client.connect();
    return await callback(client);
  } finally {
    await client?.end();
  }
};
