export { getLogger } from './getLogger';
export { Level } from './level';
export { initLogger, Logger, resetLogger } from './logger';
// TODO this should not be exported here, but the Legacy doesn't handle submodules
export * from './winston';
