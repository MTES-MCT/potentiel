require('dotenv').config()
require('pg').defaults.parseInt8 = true
const Sequelize = require('sequelize')

const {
  POSTGRESQL_ADDON_HOST,
  POSTGRESQL_ADDON_PORT,
  POSTGRESQL_ADDON_DB,
  POSTGRESQL_ADDON_USER,
  POSTGRESQL_ADDON_PASSWORD,
  POSTGRESQL_POOL_MAX,
  NODE_ENV,
  DATABASE_URL,
} = process.env

let databaseOptions = {
  dialect: 'postgres',
  ...(DATABASE_URL
    ? {
        host: DATABASE_URL,
      }
    : {
        host: POSTGRESQL_ADDON_HOST,
        username: POSTGRESQL_ADDON_USER,
        password: POSTGRESQL_ADDON_PASSWORD,
        database: POSTGRESQL_ADDON_DB,
        port: POSTGRESQL_ADDON_PORT,
        pool: {
          max: Number(POSTGRESQL_POOL_MAX),
        },
      }),
  logging: false,
}

if (NODE_ENV === 'test') {
  databaseOptions = {
    dialect: 'postgres',
    host: 'localhost',
    username: 'testuser',
    database: 'potentiel_test',
    port: 5433,
    logging: false,
    pool: {
      max: 2,
    },
  }
}

const sequelizeInstance = new Sequelize(databaseOptions)

sequelizeInstance.authenticate().catch((error) => {
  console.error(error)
  throw error
})

module.exports = databaseOptions
module.exports.sequelizeInstance = sequelizeInstance
