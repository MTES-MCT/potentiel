require('dotenv').config()
const Sequelize = require('sequelize')
const path = require('path')

const { NODE_ENV } = process.env

const databaseConfig = {
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  },
  development: {
    dialect: 'sqlite',
    storage: path.resolve(process.cwd(), '.db/db.sqlite'),
    logging: false,
  },
  staging: {
    dialect: 'sqlite',
    storage: path.resolve(process.cwd(), '.db/db.sqlite'),
    logging: false,
  },
  production: {
    dialect: 'sqlite',
    storage: path.resolve(process.cwd(), '.db/db.sqlite'),
    logging: false,
  },
}

const currentConfig = databaseConfig[NODE_ENV || 'test']

module.exports = currentConfig
module.exports.sequelize = new Sequelize(currentConfig)
