require('dotenv').config()
require('pg').defaults.parseInt8 = true
const chalk = require('chalk')
const Sequelize = require('sequelize')

const { DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD, NODE_ENV } = process.env

let databaseOptions = {
  dialect: 'postgres',
  host: DB_HOST,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: 5432,
  logging: false,
}

if (NODE_ENV === 'test') {
  databaseOptions = {
    ...databaseOptions,
    port: 5433,
    username: 'testuser',
    password: 'testpwd',
    database: 'potentiel_test',
  }
}

console.info('Sequelize configuration is ', databaseOptions)

const sequelizeInstance = new Sequelize(databaseOptions)

sequelizeInstance
  .authenticate()
  .then(() =>
    console.info(chalk.green`✅ The connection to the database has been established successfully.`)
  )
  .catch((error) => {
    console.error(
      chalk.red`❌ There was an error while trying to connect to the database > ${error}`
    )
    throw error
  })

module.exports = databaseOptions
module.exports.sequelizeInstance = sequelizeInstance
