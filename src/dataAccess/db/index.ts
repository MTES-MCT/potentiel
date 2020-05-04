import { Sequelize } from 'sequelize'
import path from 'path'

import { makeCredentialsRepo } from './credentials'
import { makeUserRepo } from './user'
import { makeProjectRepo } from './project'
import { makeCandidateNotificationRepo } from './candidateNotification'
import { makeProjectAdmissionKeyRepo } from './projectAdmissionKey'
import { makeModificationRequestRepo } from './modificationRequest'
import { makePasswordRetrievalRepo } from './passwordRetrieval'

const sequelize =
  process.env.NODE_ENV === 'test'
    ? new Sequelize('sqlite::memory:', { logging: false })
    : new Sequelize({
        dialect: 'sqlite',
        storage: path.resolve(process.cwd(), '.db/db.sqlite'),
        logging: false,
      })

// Create repo implementations
const credentialsRepo = makeCredentialsRepo({
  sequelize,
})

const userRepo = makeUserRepo({ sequelize })

const projectRepo = makeProjectRepo({ sequelize })

const candidateNotificationRepo = makeCandidateNotificationRepo({ sequelize })

const modificationRequestRepo = makeModificationRequestRepo({ sequelize })

const passwordRetrievalRepo = makePasswordRetrievalRepo({ sequelize })

// Set the one-to-many relationship between project and candidateNotification
const ProjectModel = sequelize.model('project')
const CandidateNotificationModel = sequelize.model('candidateNotification')
ProjectModel.hasMany(CandidateNotificationModel)
CandidateNotificationModel.belongsTo(ProjectModel, { foreignKey: 'projectId' })

const projectAdmissionKeyRepo = makeProjectAdmissionKeyRepo({ sequelize })

// Set the one-to-many relationship between project and projectAdmissionKeyRepo
const ProjectAdmissionKeyModel = sequelize.model('projectAdmissionKey')
ProjectModel.hasMany(ProjectAdmissionKeyModel)
ProjectAdmissionKeyModel.belongsTo(ProjectModel, { foreignKey: 'projectId' })

// Set the many-to-many relationship between projects and users
const UserModel = sequelize.model('user')
ProjectModel.belongsToMany(UserModel, { through: 'UserProjects' })
UserModel.belongsToMany(ProjectModel, { through: 'UserProjects' })

// Set the one-to-many relationship between project and modificationRequest
const ModificationRequestModel = sequelize.model('modificationRequest')
ProjectModel.hasMany(ModificationRequestModel)
ModificationRequestModel.belongsTo(ProjectModel, { foreignKey: 'projectId' })

// Set the one-to-many relationship between user and modificationRequest
UserModel.hasMany(ModificationRequestModel)
ModificationRequestModel.belongsTo(UserModel, { foreignKey: 'userId' })

// Sync the database models
const initDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }

  try {
    await sequelize.sync({ force: process.env.NODE_ENV === 'test' }) // Set to true to crush db if changes
  } catch (error) {
    console.error('Unable to sync database models', error)
  }
}

// Sync the database models
const resetDatabase = async () => {
  try {
    await sequelize.sync({ force: true })
    // console.log('Database has been emptied.')
  } catch (error) {
    console.error('Unable to drop to the database:', error)
  }
}

const dbAccess = Object.freeze({
  userRepo,
  credentialsRepo,
  projectRepo,
  candidateNotificationRepo,
  projectAdmissionKeyRepo,
  modificationRequestRepo,
  passwordRetrievalRepo,
  initDatabase,
  resetDatabase,
})

export default dbAccess
export {
  userRepo,
  credentialsRepo,
  projectRepo,
  candidateNotificationRepo,
  projectAdmissionKeyRepo,
  modificationRequestRepo,
  passwordRetrievalRepo,
  initDatabase,
  resetDatabase,
}
