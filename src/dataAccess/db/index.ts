import { Sequelize } from 'sequelize'
import path from 'path'

import { makeCredentialsRepo } from './credentials'
import { makeUserRepo } from './user'
import { makeProjectRepo } from './project'
import { makeCandidateNotificationRepo } from './candidateNotification'
import { makeProjectAdmissionKeyRepo } from './projectAdmissionKey'

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(process.cwd(), '.db/db.sqlite'),
  logging: false
})

// Create repo implementations
const credentialsRepo = makeCredentialsRepo({
  sequelize
})

const userRepo = makeUserRepo({ sequelize })

const projectRepo = makeProjectRepo({ sequelize })

const candidateNotificationRepo = makeCandidateNotificationRepo({ sequelize })

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

// Sync the database models
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
    return sequelize.sync({ force: false }) // Set to true to crush db if changes
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })
  .then(() => {
    console.log('Database models are sync')
  })
  .catch(err => {
    console.error('Unable to sync database models')
  })

const dbAccess = Object.freeze({
  userRepo,
  credentialsRepo,
  projectRepo,
  candidateNotificationRepo,
  projectAdmissionKeyRepo
})

export default dbAccess
export {
  userRepo,
  credentialsRepo,
  projectRepo,
  candidateNotificationRepo,
  projectAdmissionKeyRepo
}
