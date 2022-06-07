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

  return `
# Evenements

Tous les "faits" métier sont persistés sous forme d'événements.
Si quelque chose s'est passé sur l'application, alors il y aura un événement correspondant.

Ces événements peuvent être émis par différentes parties de l'application.
Ils peuvent également être écoutés pour le déclenchement d'effets (ex: envoi d'un email) ou la mise à jour de [projections](./PROJECTIONS.md).

## Sommaire
${SommaireEvenementsParModule(modules)}

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
${Object.entries(modules)
  .map(([module, events]) => SommaireModuleItem(module, events))
  .join('\n')}`
}

function SommaireModuleItem(module: string, events: EventResult[]) {
  return `- ${module}
${events.map(SommaireEventItem).join('\n')}
`
}

function SommaireEventItem({ name }: EventResult) {
  return `  - [${name}](#${name.toLowerCase()})`
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
          )}) de [${projection}](./PROJECTIONS.md#${projection.toLowerCase()})`
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
