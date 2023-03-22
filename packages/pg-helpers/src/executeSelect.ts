import { useClient } from './useClient';

export const executeSelect = async <TResult extends Record<string, unknown>>(
  query: string,
  ...values: unknown[]
): Promise<TResult[]> => {
  const result = await useClient((client) => client.query<TResult>(query, values));
  return result.rows;
};
