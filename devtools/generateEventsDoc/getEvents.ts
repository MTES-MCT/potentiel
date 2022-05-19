import {
  FunctionDeclaration,
  Identifier,
  JSDoc,
  MethodDeclaration,
  Node,
  Project,
  PropertyAssignment,
  ReferenceEntry,
  SourceFile,
  SyntaxKind,
} from 'ts-morph'

export function getEvents(project: Project) {
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

      const sourceFilePath = eventNode.getSourceFile().getFilePath()
      const module = extractDirBefore(sourceFilePath, '/events/')

      const eventResult: EventResult = {
        name: eventName,
        description: getJSDocComment(eventNode),
        module,
        sourceFile: sourceFilePath,
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

export type EventResult = {
  name: string
  description?: string
  module: string
  sourceFile: string
  projectionUpdates: ProjectionUpdate[]
  eventHandlers: EventHandler[]
  publishers: {
    fileName: string
    aggregateMethod?: string
    sourceFile: string
  }[]
  others: {
    ref: ReferenceEntry
    sourceFile: string
  }[]
}

type ProjectionUpdate = {
  sourceFile: string
  projection: string
}

type EventHandler = {
  module: string
  fileName: string
  sourceFile: string
}

function getJSDocComment(eventNode: Identifier): string | undefined {
  const commentNode = eventNode
    .getPreviousSiblings()
    .find((node): node is JSDoc => node.getKind() === SyntaxKind.JSDocComment)

  const comment =
    commentNode &&
    (typeof commentNode.compilerNode.comment === 'string'
      ? commentNode.compilerNode.comment
      : commentNode.compilerNode.comment?.join('\n'))
  return comment
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

function addAggregatePublisher(eventReference: ReferenceEntry, eventResult: EventResult) {
  const sourceFile = eventReference.getSourceFile()

  function addUniqueAggregateMethod(
    methodDeclaration: ReturnType<typeof findAggregateMethodDefinition>
  ) {
    const aggregateMethod = (
      methodDeclaration as MethodDeclaration | PropertyAssignment
    ).compilerNode.name.getText()
    const alreadyAdded = eventResult.publishers.some(
      (publisher) =>
        publisher.sourceFile === sourceFile.getFilePath() &&
        publisher.aggregateMethod === aggregateMethod
    )

    if (!alreadyAdded) {
      eventResult.publishers.push({
        fileName: sourceFile.getBaseNameWithoutExtension(),
        sourceFile: sourceFile.getFilePath(),
        aggregateMethod,
      })
    }
  }

  const methodDeclaration = findAggregateMethodDefinition(eventReference.getNode())
  if (methodDeclaration) {
    // Event is emitted inside the aggregate method declaration itself
    addUniqueAggregateMethod(methodDeclaration)

    return
  }

  // It's not a direct aggregate method, maybe a function declaration
  const functionDeclaration = eventReference
    .getNode()
    .getParentWhile((_, child) => child.getKind() !== SyntaxKind.FunctionDeclaration) as
    | FunctionDeclaration
    | SourceFile

  if (functionDeclaration !== sourceFile) {
    // Event is emitted from inside a function

    const calls = findCallReferences(functionDeclaration)
    for (const callRef of calls) {
      const methodDeclaration = findAggregateMethodDefinition(callRef.getNode())
      if (methodDeclaration) {
        // This function is called from inside a aggregate method
        addUniqueAggregateMethod(methodDeclaration)

        continue
      }

      console.log(
        'Event is emitted from a function inside an aggregate, but this function is not called by any aggregate commands (maybe there is another function involved (separated by another degree) ?'
      )
    }

    return
  }

  console.log(
    'Event is emitted from inside an aggregate but not by an aggregate method and not inside a function declaration',
    eventReference
  )
}

function addPublisher(eventReference: ReferenceEntry, eventResult: EventResult) {
  const sourceFile = eventReference.getSourceFile()

  if (isAggregateFile(eventReference)) {
    addAggregatePublisher(eventReference, eventResult)
    return
  }

  if (
    eventResult.publishers.find(
      ({ sourceFile }) => sourceFile === eventReference.getSourceFile().getFilePath()
    )
  ) {
    return
  }
  eventResult.publishers.push({
    fileName: sourceFile.getBaseNameWithoutExtension(),
    sourceFile: sourceFile.getFilePath(),
  })
}

function findAggregateMethodDefinition(node: Node) {
  const result = node.getParentWhile(
    (_, child) =>
      child.getKind() !== SyntaxKind.MethodDeclaration &&
      child.getKind() !== SyntaxKind.PropertyAssignment &&
      child.getKind() !== SyntaxKind.ShorthandPropertyAssignment
  ) as MethodDeclaration | PropertyAssignment | SourceFile

  return result === node.getSourceFile() ? undefined : result
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

function findCallReferences(node: Node) {
  const references: ReferenceEntry[] = []

  if (Node.isReferenceFindable(node)) {
    const referenceSymbols = node.findReferences()

    for (const referenceSymbol of referenceSymbols) {
      for (const reference of referenceSymbol.getReferences()) {
        if (!reference.isDefinition()) {
          references.push(reference)
        }
      }
    }
  }

  return references
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
