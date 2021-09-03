
const { promises: fs } = require('fs')
const path = require('path')

const { MODULES_DIR } = require('../constants')
const pathExists = require('./pathExists')

module.exports = async function(moduleName) {

  const moduleUsecasesPath = path.resolve(MODULES_DIR, moduleName, 'useCases')
  if(!await pathExists(moduleUsecasesPath)) return []

  return (await fs.readdir(moduleUsecasesPath)).filter(name => name !== 'index.ts' && name.includes('.ts') && !name.includes('.spec.ts')).map(name => name.substring(0, name.indexOf('.')))
}