const { MODULES_DIR } = require('../constants') 
const { promises: fs } = require('fs')
const path = require('path')
const pathExists = require('./pathExists')
const { pascalCase } = require('change-case')

module.exports = async function(queryName){

  if(!queryName) return null

  for(const module of await fs.readdir(MODULES_DIR)){
    if(module.includes('.')) continue

    const queryPath = path.resolve(MODULES_DIR, module, 'queries', `${pascalCase(queryName)}.ts`)
    if(await pathExists(queryPath)){
      return queryPath
    }
  }

  return null
}