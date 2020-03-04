import { Sequelize } from 'sequelize'
import path from 'path'

import { makeCredentialsRepo } from './credentials'
import { makeUserRepo } from './user'
import { makeProjectRepo } from './project'

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(process.cwd(), '.db/db.sqlite')
})

// Create repo implementations
const credentialsRepo = makeCredentialsRepo({
  sequelize
})

const userRepo = makeUserRepo({ sequelize })

const projectRepo = makeProjectRepo({ sequelize })

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
  projectRepo
})

export default dbAccess
export { userRepo, credentialsRepo, projectRepo }
