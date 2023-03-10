import { useClient } from './useClient';

export const executeQuery = (query: string, ...values: unknown[]) =>
  useClient((client) => client.query(query, values));
