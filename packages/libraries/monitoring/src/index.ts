export { Level } from './level';
export { initLogger, resetLogger, Logger } from './logger';
export { getLogger } from './getLogger';

// TODO this should not be exported here, but the Legacy doesn't handle submodules
export * from './winston';
