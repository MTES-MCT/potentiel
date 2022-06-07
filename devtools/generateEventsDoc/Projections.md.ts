import path from 'node:path'
import { EventResult } from './getEvents'

export function ProjectionsDocument(events: EventResult[]) {
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
# Projections

Les projections sont les tables de base de données qui représentent un état à date.
Elles sont mises à jour par les différents [événements](./EVENTS.md).

Les données qui sont affichées dans les vues sont issues de ces projections.

## Sommaire
${SommaireProjections(projections)}

${Projections(projections)}
  `
}

function SommaireProjections(projections: Record<string, EventResult[]>) {
  return `
${Object.keys(projections)
  .sort((a, b) => a.localeCompare(b))
  .map((projection) => `- [${projection}](#${projection.toLowerCase()})`)
  .join('\n')}`
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
### ${projection}
Mise à jour par:
${events
  .map(({ name, sourceFile }) => `- [${name}](./Events.md#${name.toLowerCase()})`)
  .join('\n\n')}
`
}

function relativeFilePath(absolutePath: string) {
  return path.relative(path.resolve(__dirname, '..'), absolutePath)
}
