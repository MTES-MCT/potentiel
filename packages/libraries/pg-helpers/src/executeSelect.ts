import { usePoolClient } from './usePoolClient.js';

export const executeSelect = async <TResult extends Record<string, unknown>>(
  query: string,
  ...values: unknown[]
): Promise<TResult[]> => {
  const result = await usePoolClient((client) => client.query<TResult>(query, values));
  return result.rows;
};
