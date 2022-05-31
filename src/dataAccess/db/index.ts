import { sequelizeInstance } from '../../sequelize.config'

import { makeUserRepo } from './user'
import { makeProjectRepo, getFullTextSearchOptions } from './project'
import { makeModificationRequestRepo } from './modificationRequest'
import { logger } from '@core/utils'

import { appelOffreRepo } from '../inMemory/appelOffre'
import { appelsOffreStatic } from '../inMemory/appelOffre'
import truncateAllTables from './helpers/truncateTables'
import { makeGetProjectAppelOffre } from '@modules/projectAppelOffre'

// Create repo implementations

const userRepo = makeUserRepo({ sequelizeInstance })

const getProjectAppelOffre = makeGetProjectAppelOffre(appelsOffreStatic)
const projectRepo = makeProjectRepo({ sequelizeInstance, getProjectAppelOffre })

const modificationRequestRepo = makeModificationRequestRepo({ sequelizeInstance })

const ProjectModel = sequelizeInstance.model('project')

// Set the many-to-many relationship between projects and users
const UserModel = sequelizeInstance.model('user')
ProjectModel.belongsToMany(UserModel, { through: 'UserProjects' })
UserModel.belongsToMany(ProjectModel, { through: 'UserProjects' })

// Set the one-to-many relationship between project and modificationRequest
const ModificationRequestModel = sequelizeInstance.model('modificationRequest')
ProjectModel.hasMany(ModificationRequestModel)
ModificationRequestModel.belongsTo(ProjectModel, { foreignKey: 'projectId' })

// Set the one-to-many relationship between user and modificationRequest
UserModel.hasMany(ModificationRequestModel)
ModificationRequestModel.belongsTo(UserModel, { foreignKey: 'userId' })

// Sync the database models
let _isDatabaseInitialized = false
const initDatabase = async () => {
  if (_isDatabaseInitialized) {
    logger.info('initDatabase: db was already initialized.')
    return
  }

  try {
    await sequelizeInstance.authenticate()
  } catch (error) {
    logger.error(error)
  }

  _isDatabaseInitialized = true
}

// Flush all tables
const resetDatabase = async () => {
  try {
    await truncateAllTables()
  } catch (error) {
    logger.error(error)
  }
}

const dbAccess = Object.freeze({
  userRepo,
  projectRepo,
  modificationRequestRepo,
  appelOffreRepo,
  initDatabase,
  resetDatabase,
})

export default dbAccess
export {
  userRepo,
  projectRepo,
  modificationRequestRepo,
  appelOffreRepo,
  initDatabase,
  resetDatabase,
  getFullTextSearchOptions,
}
