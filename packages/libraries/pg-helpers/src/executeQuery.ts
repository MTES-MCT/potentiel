import { usePoolClient } from './useClient';

export const executeQuery = (query: string, ...values: unknown[]) =>
  usePoolClient((client) => client.query(query, values));
