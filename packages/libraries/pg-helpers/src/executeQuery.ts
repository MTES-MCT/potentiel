import { usePoolClient } from './usePoolClient.js';

export const executeQuery = (query: string, ...values: unknown[]) =>
  usePoolClient((client) => client.query(query, values));
