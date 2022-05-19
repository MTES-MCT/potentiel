import { EventResult } from './getEvents'
import path from 'node:path'

export function EventsDocument(events: EventResult[]) {
  // TODO: mark the unpublished events as deprecated (mention that it cannot be deleted because there might be items in the db with this type)
  // TODO: fetch comments written above the class definition
  // TODO: other way around : for each projection, which events update
  const modules = events.reduce<Record<string, EventResult[]>>((moduleMap, event) => {
    const { module } = event
    if (!moduleMap[module]) {
      moduleMap[module] = []
    }

    moduleMap[module].push(event)

    return moduleMap
  }, {})

  return `
# Evenements

${Sommaire(modules)}

${Modules(modules)}
  `
}

export function Sommaire(modules: Record<string, EventResult[]>) {
  return `
## Sommaire

${Object.entries(modules)
  .map(([module, events]) => SommaireModuleItem(module, events))
  .join('\n')}`
}

function SommaireModuleItem(module: string, events: EventResult[]) {
  return `
- ${module}
${events.map(SommaireEventItem).join('\n')}
`
}

function SommaireEventItem({ name }: EventResult) {
  return `  - [${name}](#${name.toLowerCase()})`
}

export function Modules(modules: Record<string, EventResult[]>) {
  return `
## Événements par module

${Object.entries(modules)
  .map(([module, events]) => DetailedModuleItem(module, events))
  .join('\n')}
  `
}

function DetailedModuleItem(module: string, events: EventResult[]) {
  return `
## ${module}
${events
  .map(
    ({ name, sourceFile, publishers, eventHandlers, projectionUpdates }) => `
### ${name}
[aller à la définition](${relativeFilePath(sourceFile)})

${Publishers(publishers)}
${ProjectionUpdates(projectionUpdates)}
${EventHandlers(eventHandlers)}
`
  )
  .join('\n\n')}
`
}

function Publishers(publishers: EventResult['publishers']) {
  return publishers.length
    ? `- Emis par
${publishers
  .map(({ fileName, sourceFile }) => `  - [${fileName}](${relativeFilePath(sourceFile)})`)
  .join('\n')}`
    : ''
}

function ProjectionUpdates(projectionUpdates: EventResult['projectionUpdates']) {
  return projectionUpdates.length
    ? `- Mets à jour
${projectionUpdates
  .map(({ projection, sourceFile }) => `  - [${projection}](${relativeFilePath(sourceFile)})`)
  .join('\n')}`
    : ''
}

function EventHandlers(eventHandlers: EventResult['eventHandlers']) {
  return eventHandlers.length
    ? `- Déclenche
${eventHandlers
  .map(
    ({ module, fileName, sourceFile }) =>
      `  - ${module} / [${fileName}](${relativeFilePath(sourceFile)})`
  )
  .join('\n')}`
    : ''
}

function relativeFilePath(absolutePath: string) {
  return path.relative(path.resolve(__dirname, '..'), absolutePath)
}
