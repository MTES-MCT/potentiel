import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { Project } from 'ts-morph'
import { EventsDocument } from './EventsDocument.template'
import { getEvents } from './getEvents'

generateEventsDoc()

async function generateEventsDoc() {
  console.log('Extraction des événements du code...')

  const project = new Project({
    tsConfigFilePath: path.resolve(__dirname, '../../tsconfig.json'),
  })

  const events = getEvents(project)

  const eventsDocPath = path.resolve(__dirname, '../../docs/EVENTS.md')

  await writeFile(eventsDocPath, EventsDocument(events))

  console.log(`La documentation a été générée dans ${eventsDocPath}`)
}
