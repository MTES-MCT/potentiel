
const { promises: fs } = require('fs')
const path = require('path')

const getModules = require('./getModules')

const { MODULES_DIR } = require('../constants')
const pathExists = require('./pathExists')


module.exports = async function() {

  const modules = await getModules()

  const events = []

  for(const module of modules){

    const moduleEventsPath = path.resolve(MODULES_DIR, module, 'events')
    if(!await pathExists(moduleEventsPath)) continue

    const moduleEvents = (await fs.readdir(moduleEventsPath)).filter(name => name !== 'index.ts' && name.includes('.ts')).map(name => name.substring(0, name.indexOf('.')))

    events.push(...moduleEvents)
  }

  return events;

}