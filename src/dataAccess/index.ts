import { Sequelize } from 'sequelize'
import * as path from 'path'

import loadModels from './models'

import makeCredentialsAccess from './credentials'

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '../../.db/db.sqlite')
})

const { credentialsDb } = loadModels({ sequelize })

const isDbReady = sequelize
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

const credentialsAccess = makeCredentialsAccess({
  isDbReady,
  credentialsDb
})

const dataAccess = Object.freeze({
  credentialsAccess
})

export default dataAccess
export { credentialsAccess }
