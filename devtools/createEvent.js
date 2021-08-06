const base = require('./base')

const { promises: fs } = require('fs')
const prompts = require('prompts')
const path = require('path')

const getEvents = require('./helpers/getEvents')

const { MODULES_DIR } = require('./constants')
const pathExists = require('./helpers/pathExists')
const getModules = require('./helpers/getModules')
const createFileAndBarrel = require('./helpers/createFileAndBarrel')

const eventTemplate = require('./templates/EventName.ts')
const { resolve } = require('path')
const { noCase } = require('no-case')
const { pascalCase } = require('pascal-case')

const createEvent = async () => {
  const { eventNameRaw } = await prompts({
    type: 'text',
    name: 'eventNameRaw',
    message: 'Quel est le nom de cet événement ?'
  })
  if(!eventNameRaw) return
  const eventName = noCase(eventNameRaw)
  console.log('Chosen eventName: ', pascalCase(eventName))

  const existingEvents = await getEvents()

  if(existingEvents.includes(pascalCase(eventName))){
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
  const eventsPath = path.resolve(modulePath, 'events')

  // Create events/EventName.ts
  const newEventPath = path.resolve(eventsPath, `${pascalCase(eventName)}.ts`)
  await createFileAndBarrel(newEventPath, eventTemplate({ eventName }))

  console.log(`New event : ${newEventPath}`)

  return eventName
}

base
  .command(['event', 'e' ], 'generate a new event', (yargs) => {
  }, async function (argv) {

    await createEvent()
  })

module.exports = createEvent