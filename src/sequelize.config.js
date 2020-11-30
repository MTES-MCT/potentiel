require('dotenv').config()
require('pg').defaults.parseInt8 = true
const chalk = require('chalk')
const Sequelize = require('sequelize')

const { DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD, DB_POOL_MAX, NODE_ENV } = process.env

let databaseOptions = {
  dialect: 'postgres',
  host: DB_HOST,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
  logging: false,
  pool: {
    max: Number(DB_POOL_MAX),
  },
}

if (NODE_ENV === 'test') {
  databaseOptions = {
    dialect: 'postgres',
    host: 'localhost',
    username: 'testuser',
    database: 'potentiel_test',
    port: 5433,
    logging: false,
  }
}

const sequelizeInstance = new Sequelize(databaseOptions)

sequelizeInstance.authenticate().catch((error) => {
  console.error(chalk.red`❌ There was an error while trying to connect to the database > ${error}`)
  throw error
})

module.exports = databaseOptions
module.exports.sequelizeInstance = sequelizeInstance
