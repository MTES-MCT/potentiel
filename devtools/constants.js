const path = require('path')

const ROOT_DIR = path.resolve(__dirname, '../')

const SERVER_DIR = path.resolve(ROOT_DIR)
const PROJECTIONS_DIR = path.resolve(SERVER_DIR, 'src', 'infra', 'sequelize', 'projections')
const QUERIES_DIR = path.resolve(SERVER_DIR, 'src', 'infra', 'sequelize', 'queries')
const MODELS_PATH = path.resolve(SERVER_DIR, 'src', 'infra',  'sequelize', 'models.ts')
const ROUTES_DIR = path.resolve(SERVER_DIR, 'src', 'controllers')

const MODULES_DIR = path.resolve(ROOT_DIR, 'src', 'modules')


module.exports = {
  ROOT_DIR,
  SERVER_DIR,
  PROJECTIONS_DIR,
  QUERIES_DIR,
  MODELS_PATH,
  MODULES_DIR,
  ROUTES_DIR,
}