import { EventResult } from './getEvents'
import path from 'node:path'

export function EventsDocument(events: EventResult[]) {
  const modules = events.reduce<Record<string, EventResult[]>>((moduleMap, event) => {
    const { module } = event
    if (!moduleMap[module]) {
      moduleMap[module] = []
    }

    moduleMap[module].push(event)

    return moduleMap
  }, {})

  const projections = events.reduce<Record<string, EventResult[]>>((projectionMap, event) => {
    const { projectionUpdates } = event

    for (const projectionUpdate of projectionUpdates) {
      const { projection } = projectionUpdate
      if (!projectionMap[projection]) {
        projectionMap[projection] = []
      }

      projectionMap[projection].push(event)
    }

    return projectionMap
  }, {})

  return `
# Evenements

## Sommaire
${SommaireProjections(projections)}
${SommaireEvenementsParModule(modules)}

${Projections(projections)}
${Modules(modules)}
  `
}

function SommaireProjections(projections: Record<string, EventResult[]>) {
  return `
- Projections (tables)
${Object.keys(projections)
  .sort((a, b) => a.localeCompare(b))
  .map((projection) => `  - [${projection}](#table-${projection.toLowerCase()})`)
  .join('\n')}`
}

function SommaireEvenementsParModule(modules: Record<string, EventResult[]>) {
  return `
- Événements par module
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
  return `    - [${name}](#${name.toLowerCase()})`
}

function Projections(projections: Record<string, EventResult[]>) {
  return `
## Projections

${Object.entries(projections)
  .sort((a, b) => a[0].localeCompare(b[0]))
  .map(([projection, events]) => DetailedProjectionItem(projection, events))
  .join('\n')}
  `
}

function DetailedProjectionItem(projection: string, events: EventResult[]) {
  return `
### Table ${projection}
Mise à jour par:
${events
  .map(
    ({ name }) => `
  - [${name}](#${name.toLowerCase()})
`
  )
  .join('\n\n')}
`
}

function Modules(modules: Record<string, EventResult[]>) {
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
    ({ name, description, sourceFile, publishers, eventHandlers, projectionUpdates }) => `
### [${name}](${relativeFilePath(sourceFile)})
${description ? `>${description.split('\n').join('\n>')}` : ''}

${Table([
  {
    heading: 'Emetteurs',
    rows: publishers.map(
      ({ fileName, sourceFile, aggregateMethod }) =>
        `[${fileName}${aggregateMethod ? `.${aggregateMethod}` : ''}](${relativeFilePath(
          sourceFile
        )})`
    ),
  },
  {
    heading: 'Récepteurs',
    rows: [
      ...projectionUpdates.map(
        ({ projection, sourceFile }) =>
          `[Mise à jour](${relativeFilePath(
            sourceFile
          )}) de [${projection}](#table-${projection.toLowerCase()})`
      ),
      ...eventHandlers.map(
        ({ module, fileName, sourceFile }) =>
          `${module} / [${fileName}](${relativeFilePath(sourceFile)})`
      ),
    ],
  },
])}
`
  )
  .join('\n\n')}
`
}

function Publishers(publishers: EventResult['publishers']) {
  return publishers.length
    ? `- Emis par
${publishers
  .map(
    ({ fileName, sourceFile, aggregateMethod }) =>
      `  - [${fileName}${aggregateMethod ? `.${aggregateMethod}` : ''}](${relativeFilePath(
        sourceFile
      )})`
  )
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

function Table(columns: { heading: string; rows: string[] }[]) {
  const maxRows = columns.reduce((max, { rows }) => Math.max(max, rows.length), 0)

  let table = `
|${columns.map(({ heading }) => heading).join('|')}|
|${columns.map(() => '---').join('|')}|
`

  for (let i = 0; i < maxRows; i++) {
    table += `|${columns.map(({ rows }) => rows[i] || '').join('|')}|\n`
  }

  return table
}
