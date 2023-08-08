import { QueryResult, Pool, PoolClient } from 'pg';
import { getConnectionString } from './getConnectionString';

let pool: Pool | undefined;

export const usePoolClient = async <TResult extends Record<string, unknown>>(
  callback: (poolClient: PoolClient) => Promise<QueryResult<TResult>>,
) => {
  if (!pool) {
    pool = new Pool({
      connectionString: getConnectionString(),
    });
  }

  let poolClient: PoolClient | undefined;

  try {
    poolClient = await pool.connect();
    return await callback(poolClient);
  } finally {
    poolClient?.release();
  }
};

export const killPool = async () => {
  await pool?.end();
  pool = undefined;
};
