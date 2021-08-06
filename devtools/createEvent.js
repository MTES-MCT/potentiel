const base = require('./base')

const { promises: fs } = require('fs')
const prompts = require('prompts')
const path = require('path')

const getEvents = require('./helpers/getEvents')

const { MODULES_DIR } = require('./constants')
const pathExists = require('./helpers/pathExists')
const getModules = require('./helpers/getModules')

const eventTemplate = require('./templates/EventName.ts')
const { resolve } = require('path')

const createEvent = async () => {
  const { eventName } = await prompts({
    type: 'text',
    name: 'eventName',
    message: 'Quel est le nom de cet événement ?'
  })
  if(!eventName) return
  console.log('Chosen eventName: ', eventName)

  const existingEvents = await getEvents()

  if(existingEvents.map(event => event.toLowerCase()).includes(eventName.toLowerCase())){
    console.log(`Il y a déjà un événement avec ce nom`)
    return
  }

  // Ask the user for the module

  const existingModules = await getModules()
  const { module } = await prompts({
    type: 'autocomplete',
    name: 'module',
    message: 'Dans quel module ?',
    choices: existingModules.map(moduleName => ({ title: moduleName }))
  })
  if(!module) return
  console.log('Chosen module: ', module)

  const modulePath = path.resolve(MODULES_DIR, module)
  const moduleIndexPath = path.resolve(modulePath, 'index.ts')

  // Create events folder if it does not exist
  const eventsPath = path.resolve(modulePath, 'events')
  const eventsIndexPath = path.resolve(eventsPath, 'index.ts')
  if(!await pathExists(eventsPath)){
    await fs.mkdir(eventsPath)
    await fs.appendFile(moduleIndexPath, `export * from './events';`)
    await fs.writeFile(eventsIndexPath, `export * from './${eventName}';`)
  }
  else{
    await fs.appendFile(eventsIndexPath, `export * from './${eventName}';`)
  }

  // Create events/EventName.ts
  const newEventPath = path.resolve(eventsPath, `${eventName}.ts`)
  await fs.writeFile(newEventPath, eventTemplate({ eventName }))

  console.log(`New event : ${newEventPath}`)

  return eventName
}

base
  .command(['event', 'e' ], 'generate a new event', (yargs) => {
  }, async function (argv) {

    await createEvent()
  })

module.exports = createEvent