require('dotenv').config()
const Sequelize = require('sequelize')
const path = require('path')

const { NODE_ENV } = process.env

const databaseConfig = {
  development: {
    dialect: 'sqlite',
    storage: path.resolve(process.cwd(), '.db/db.sqlite'),
    logging: false,
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  },
  production: {
    dialect: 'sqlite',
    storage: path.resolve(process.cwd(), '.db/db.sqlite'),
    logging: false,
  },
}

const currentConfig = databaseConfig[NODE_ENV || 'development']

module.exports = currentConfig
module.exports.sequelize = new Sequelize(currentConfig)
