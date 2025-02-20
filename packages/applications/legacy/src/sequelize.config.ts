import dotenv from 'dotenv';
import pg from 'pg';
import { parse } from 'pg-connection-string';
import { Options, Sequelize } from 'sequelize';

dotenv.config();
pg.defaults.parseInt8 = true;

if (!process.env.DATABASE_CONNECTION_STRING) {
  throw new Error('DATABASE_CONNECTION_STRING env variable is not defined');
}

const getOptionsFromUrl = (url): Options => {
  const { host, port, database, user: username, password } = parse(url);

  return {
    host: host ?? undefined,
    username,
    password,
    database: database ?? undefined,
    port: port ? +port : undefined,
  };
};

const { POSTGRESQL_POOL_MAX, APPLICATION_STAGE, DATABASE_CONNECTION_STRING } = process.env;
const options = getOptionsFromUrl(DATABASE_CONNECTION_STRING);

let databaseOptions: Options = {
  dialect: 'postgres',
  ...options,
  pool: {
    max: Number(POSTGRESQL_POOL_MAX),
  },
  logging: false,
};

if (APPLICATION_STAGE === 'test') {
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
  };
}

const sequelizeInstance = new Sequelize(databaseOptions);

sequelizeInstance.authenticate().catch((error) => {
  console.error(error);
  throw error;
});

module.exports = databaseOptions;
module.exports.sequelizeInstance = sequelizeInstance;

export { sequelizeInstance };
