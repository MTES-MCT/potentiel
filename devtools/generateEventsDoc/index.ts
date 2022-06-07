import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { Project } from 'ts-morph'
import { EventsDocument } from './Events.md'
import { ProjectionsDocument } from './Projections.md'
import { getEvents } from './getEvents'

generateEventsDoc()

async function generateEventsDoc() {
  console.log('Extraction des événements du code...')

  const project = new Project({
    tsConfigFilePath: path.resolve(__dirname, '../../tsconfig.json'),
  })

  const events = getEvents(project)

  const eventsDocPath = path.resolve(__dirname, '../../docs/EVENTS.md')
  const projectionsDocPath = path.resolve(__dirname, '../../docs/PROJECTIONS.md')

  await writeFile(eventsDocPath, EventsDocument(events))
  await writeFile(projectionsDocPath, ProjectionsDocument(events))

  console.log(`La documentation des événements a été générée dans ${eventsDocPath}`)
  console.log(`La documentation des projections a été générée dans ${projectionsDocPath}`)
}
