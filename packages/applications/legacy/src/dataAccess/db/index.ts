import { sequelizeInstance } from '../../sequelize.config';

import { makeUserRepo } from './user';
import { makeProjectRepo, getFullTextSearchOptions } from './project';
import { logger } from '../../core/utils';

import { appelOffreRepo } from '../inMemory/appelOffreRepo';
import { appelsOffreStatic } from '../inMemory/appelOffreStatic';
import truncateAllTables from './helpers/truncateTables';
import { makeGetProjectAppelOffre } from '../../modules/projectAppelOffre';

// Create repo implementations

const userRepo = makeUserRepo({ sequelizeInstance });

const getProjectAppelOffre = makeGetProjectAppelOffre(appelsOffreStatic);
const projectRepo = makeProjectRepo({ sequelizeInstance, getProjectAppelOffre });

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

// Flush all tables
const resetDatabase = async () => {
  try {
    await truncateAllTables();
  } catch (error) {
    logger.error(error);
  }
};

const dbAccess = Object.freeze({
  userRepo,
  projectRepo,
  appelOffreRepo,
  initDatabase,
  resetDatabase,
});

export default dbAccess;
export {
  userRepo,
  projectRepo,
  appelOffreRepo,
  initDatabase,
  resetDatabase,
  getFullTextSearchOptions,
};
