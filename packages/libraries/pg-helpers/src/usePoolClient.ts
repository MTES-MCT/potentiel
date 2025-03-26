import { QueryResult, Pool, PoolClient } from 'pg';

import { getConnectionString } from './getConnectionString';

const FIVE_MINUTES = 5 * 60 * 1000;
let pool: Pool | undefined;

export const usePoolClient = async <TResult extends Record<string, unknown>>(
  callback: (poolClient: PoolClient) => Promise<QueryResult<TResult>>,
) => {
  if (!pool) {
    pool = new Pool({
      connectionString: getConnectionString(),
      min: 0,
      idleTimeoutMillis: FIVE_MINUTES,
      application_name: 'potentiel',
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
