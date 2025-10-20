import { sequelizeInstance } from '../../sequelize.config';

import { makeUserRepo } from './user';
import { logger } from '../../core/utils';

import { appelOffreRepo } from '../inMemory/appelOffreRepo';

// Create repo implementations

const userRepo = makeUserRepo({ sequelizeInstance });

// Sync the database models
let _isDatabaseInitialized = false;
const initDatabase = async () => {
  if (_isDatabaseInitialized) {
    logger.info('initDatabase: db was already initialized.');
    return;
  }

  try {
    await sequelizeInstance.authenticate();
  } catch (error) {
    logger.error(error);
  }

  _isDatabaseInitialized = true;
};

const dbAccess = Object.freeze({
  userRepo,
  appelOffreRepo,
  initDatabase,
});

export default dbAccess;
export { userRepo, appelOffreRepo, initDatabase };
