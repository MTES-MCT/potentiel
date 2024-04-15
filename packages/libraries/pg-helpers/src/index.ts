import { types } from 'pg';

// Set support of BigInt in node-pg (currently handled as integer in the app)
types.setTypeParser(20, (value) => parseInt(value, 10));

export { executeQuery } from './executeQuery';
export { executeSelect } from './executeSelect';
export { getConnectionString } from './getConnectionString';
export { killPool } from './usePoolClient';
