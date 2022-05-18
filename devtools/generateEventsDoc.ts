import { Node, Project, ReferenceEntry, SyntaxKind } from 'ts-morph'
import path from 'node:path'
import { writeFile } from 'node:fs/promises'

function wait() {}

async function init() {
  console.log('init')

  const project = new Project({
    tsConfigFilePath: path.resolve(__dirname, '../tsconfig.json'),
  })

  const events = getEvents(project)

  const eventsDocPath = path.resolve(__dirname, '../docs/EVENTS.md')
  // console.log(JSON.stringify(events.slice(0, 10), null, 2))

  await writeFile(eventsDocPath, eventsPage(events))

  console.log(`Documentation générée dans ${eventsDocPath}`)
}

function eventsPage(events: EventResult[]) {
  // TODO: mark the unpublished events as deprecated
  // TODO: group events by module
  return `
# Evenements

## Sommaire

${events.map(({ name }) => `- [${name}](#${name.toLowerCase()})`).join('\n')}

${events
  .map(
    ({ name, sourceFile, publishers, eventHandlers, projectionUpdates }) => `
## ${name}
[aller à la définition](${relativeFilePath(sourceFile)})

${
  publishers.length
    ? `- Emis par
${publishers
  .map(({ fileName, sourceFile }) => `  - [${fileName}](${relativeFilePath(sourceFile)})`)
  .join('\n')}`
    : ''
}
${
  projectionUpdates.length
    ? `- Mets à jour
${projectionUpdates
  .map(({ projection, sourceFile }) => `  - [${projection}](${relativeFilePath(sourceFile)})`)
  .join('\n')}`
    : ''
}
${
  eventHandlers.length
    ? `- Déclenche
${eventHandlers
  .map(
    ({ module, fileName, sourceFile }) =>
      `  - ${module} / [${fileName}](${relativeFilePath(sourceFile)})`
  )
  .join('\n')}`
    : ''
}
`
  )
  .join('\n\n')}
  `
}

function relativeFilePath(absolutePath: string) {
  return path.relative(__dirname, absolutePath)
}

init()

type ProjectionUpdate = {
  sourceFile: string
  projection: string
}

type EventHandler = {
  module: string
  fileName: string
  sourceFile: string
}

type EventResult = {
  name: string
  sourceFile: string
  projectionUpdates: ProjectionUpdate[]
  eventHandlers: EventHandler[]
  publishers: {
    fileName: string
    sourceFile: string
  }[]
  others: {
    ref: ReferenceEntry
    sourceFile: string
  }[]
}

function getEvents(project: Project) {
  const eventsUnique = new Set<string>()
  const results: EventResult[] = []

  const baseDomainEvent = getDomainEvent(project)

  let i = 0

  for (const baseEventReference of findReferences(baseDomainEvent)) {
    if (
      !isTestFile(baseEventReference) &&
      baseEventReference
        .getNode()
        .getParentOrThrow()
        .getParentOrThrow()
        .getParentOrThrow()
        .getKind() === SyntaxKind.ClassDeclaration
    ) {
      const eventNode = baseEventReference
        .getNode()
        .getParentWhileOrThrow(
          (_: any, child: any) => child.getKind() !== SyntaxKind.ClassDeclaration
        )
        .getFirstChildByKindOrThrow(SyntaxKind.Identifier)

      const eventName = eventNode.compilerNode.escapedText.toString()

      if (eventsUnique.has(eventName)) continue

      eventsUnique.add(eventName)

      const eventResult: EventResult = {
        name: eventName,
        sourceFile: eventNode.getSourceFile().getFilePath(),
        projectionUpdates: [],
        eventHandlers: [],
        publishers: [],
        others: [],
      }

      results.push(eventResult)

      for (const eventReference of findReferences(eventNode)) {
        if (isTestFile(eventReference)) continue
        if (isImport(eventReference)) continue
        if (isBarrelIndexFile(eventReference)) continue

        // NEXT UP: make a list of publishers and subscribers
        // - Create a text file (md format) with a section for each event
        // - for each event list the publishers and subscribers
        // - for each publishers/subscriber add a link to source file
        // - for each pub/sub, tell if it's a projection, event-handler, use-case, agregate, etc.
        // - if it's a use-case, check if there is a test file, link it
        // - extract the specs for the test file, insert them inside the doc (foldable section)
        // - only include the test cases which mention the event by name

        // We are not interested in import statements
        // For "new Event()", ref.getNode() is Identifier (79) and ref.getNode().getParent() is NewExpression(208)
        // For .on(Event), parent is 207 (Call Expression)

        if (isProjectionUpdate(eventReference)) {
          addProjectionUpdate(eventReference, eventResult)
        } else if (isEventHandler(eventReference)) {
          addEventHandler(eventReference, eventResult)
        } else if (isPublisher(eventReference)) {
          addPublisher(eventReference, eventResult)
        } else {
          if (isAggregateFile(eventReference)) continue
          if (isConfigFile(eventReference)) continue

          eventResult.others.push({
            ref: eventReference,
            sourceFile: eventReference.getSourceFile().getFilePath(),
          })
        }
      }
    }
  }

  return results
}

function isProjectionUpdate(eventRef: ReferenceEntry) {
  const sourceFile = eventRef.getSourceFile()
  const fileName = sourceFile.getBaseNameWithoutExtension()
  const filePath = sourceFile.getFilePath()
  return filePath.includes('/updates/') && fileName !== 'index'
}
function addProjectionUpdate(eventReference: ReferenceEntry, eventResult: EventResult) {
  if (
    eventResult.projectionUpdates.find(
      ({ sourceFile }) => sourceFile === eventReference.getSourceFile().getFilePath()
    )
  ) {
    return
  }

  const sourceFile = eventReference.getSourceFile()
  const filePath = sourceFile.getFilePath()
  const projection = extractDirBefore(filePath, '/updates/')

  eventResult.projectionUpdates.push({
    projection,
    sourceFile: filePath,
  })
}

function extractDirBefore(path, followingSegment) {
  const beginning = path.substring(0, path.indexOf(followingSegment))
  return beginning.substring(beginning.lastIndexOf('/') + 1)
}

function isEventHandler(eventRef: ReferenceEntry) {
  const sourceFile = eventRef.getSourceFile()
  const fileName = sourceFile.getBaseNameWithoutExtension()
  return fileName.startsWith('handle')
}

function addEventHandler(eventReference: ReferenceEntry, eventResult: EventResult) {
  if (
    eventResult.eventHandlers.find(
      ({ sourceFile }) => sourceFile === eventReference.getSourceFile().getFilePath()
    )
  ) {
    return
  }

  const sourceFile = eventReference.getSourceFile()
  const filePath = sourceFile.getFilePath()
  const module = extractDirBefore(filePath, '/eventHandlers')

  eventResult.eventHandlers.push({
    module,
    fileName: sourceFile.getBaseNameWithoutExtension(),
    sourceFile: filePath,
  })
}

function isPublisher(eventRef: ReferenceEntry) {
  return eventRef.getNode()?.getParent()?.getKind() === SyntaxKind.NewExpression
}

function addPublisher(eventReference: ReferenceEntry, eventResult: EventResult) {
  // If it's in an aggregate file, find which command(s) trigger(s) the event

  if (
    eventResult.publishers.find(
      ({ sourceFile }) => sourceFile === eventReference.getSourceFile().getFilePath()
    )
  ) {
    return
  }

  const sourceFile = eventReference.getSourceFile()
  eventResult.publishers.push({
    fileName: sourceFile.getBaseNameWithoutExtension(),
    sourceFile: sourceFile.getFilePath(),
  })
}

function isImport(eventRef: ReferenceEntry) {
  return (
    eventRef
      .getNode()
      ?.getParentWhile((_, child) => child.getKind() !== SyntaxKind.ImportSpecifier) !==
    eventRef.getSourceFile()
  )
}

function isAggregateFile(eventRef: ReferenceEntry) {
  return eventRef.getSourceFile().getText().includes('EventStoreAggregate')
}

function isConfigFile(eventRef: ReferenceEntry) {
  return eventRef.getSourceFile().getFilePath().includes('/config/')
}

function isBarrelIndexFile(eventRef: ReferenceEntry) {
  return eventRef.getSourceFile().getBaseName() === 'index.ts'
}

function isTestFile(ref: ReferenceEntry) {
  const filePath = ref.getSourceFile().getFilePath()
  const sourceFile = ref.getSourceFile().getBaseName()
  return (
    sourceFile.endsWith('.spec.ts') ||
    sourceFile.endsWith('.integration.ts') ||
    filePath.includes('__tests__')
  )
}

function getDomainEvent(project: Project) {
  const baseDomainEventFile = project.getSourceFileOrThrow('DomainEvent.ts')

  const baseDomainEventLine = baseDomainEventFile.getStatementOrThrow(
    (stmt) =>
      stmt
        .getChildren()
        // @ts-ignore
        .findIndex((child) => child.compilerNode.escapedText === 'BaseDomainEvent') !== -1
  )

  const baseDomainEvent = baseDomainEventLine
    .getChildren()
    // @ts-ignore
    .find((child) => child.compilerNode.escapedText === 'BaseDomainEvent')

  if (!baseDomainEvent) {
    throw new Error('Could not find BaseDomainEvent')
  }

  return baseDomainEvent
}

function findReferences(node: Node | undefined) {
  const references: ReferenceEntry[] = []

  if (node && Node.isReferenceFindable(node)) {
    const referenceSymbols = node.findReferences()

    for (const referenceSymbol of referenceSymbols) {
      for (const reference of referenceSymbol.getReferences()) {
        if (reference.getSourceFile().getFilePath() !== node.getSourceFile().getFilePath()) {
          references.push(reference)
        }
      }
    }
  }

  return references
}
