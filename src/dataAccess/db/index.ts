import { sequelizeInstance } from '../../sequelize.legacy.config'

import { makeCredentialsRepo } from './credentials'
import { makeUserRepo } from './user'
import { makeProjectRepo } from './project'
import { makeProjectAdmissionKeyRepo } from './projectAdmissionKey'
import { makeModificationRequestRepo } from './modificationRequest'
import { makePasswordRetrievalRepo } from './passwordRetrieval'
import { logger } from '../../core/utils'

import { appelOffreRepo } from '../inMemory/appelOffre'
import truncateAllTables from './helpers/truncateTables'

// Create repo implementations
const credentialsRepo = makeCredentialsRepo({
  sequelizeInstance,
})

const userRepo = makeUserRepo({ sequelizeInstance })

const projectRepo = makeProjectRepo({ sequelizeInstance, appelOffreRepo })

const modificationRequestRepo = makeModificationRequestRepo({ sequelizeInstance })

const passwordRetrievalRepo = makePasswordRetrievalRepo({ sequelizeInstance })

const ProjectModel = sequelizeInstance.model('project')

const projectAdmissionKeyRepo = makeProjectAdmissionKeyRepo({ sequelizeInstance })

// Set the one-to-many relationship between project and projectAdmissionKeyRepo
const ProjectAdmissionKeyModel = sequelizeInstance.model('projectAdmissionKey')
ProjectModel.hasMany(ProjectAdmissionKeyModel)
ProjectAdmissionKeyModel.belongsTo(ProjectModel, { foreignKey: 'projectId' })

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

  if (process.env.NODE_ENV === 'test') {
    try {
      // only need to sync when test (in-memory) database
      // The db tables are created using migration scripts eitherwise
      await sequelizeInstance.sync({ force: true })
    } catch (error) {
      logger.error(error)
    }
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
  credentialsRepo,
  projectRepo,
  projectAdmissionKeyRepo,
  modificationRequestRepo,
  passwordRetrievalRepo,
  appelOffreRepo,
  initDatabase,
  resetDatabase,
})

export default dbAccess
export {
  userRepo,
  credentialsRepo,
  projectRepo,
  projectAdmissionKeyRepo,
  modificationRequestRepo,
  passwordRetrievalRepo,
  appelOffreRepo,
  initDatabase,
  resetDatabase,
}
