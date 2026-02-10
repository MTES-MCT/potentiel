import { types } from 'pg';

// Set support of BigInt in node-pg (currently handled as integer in the app)
types.setTypeParser(20, (value) => parseInt(value, 10));

export { executeQuery } from './executeQuery.js';
export { executeSelect } from './executeSelect.js';
export { getConnectionString } from './getConnectionString.js';
export { killPool } from './usePoolClient.js';
