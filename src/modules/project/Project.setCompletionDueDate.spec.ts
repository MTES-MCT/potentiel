import { DomainEvent, UniqueEntityID } from '../../core/domain'
import { UnwrapForTest } from '../../core/utils'
import { appelsOffreStatic } from '../../dataAccess/inMemory/appelOffre'
import { makeUser } from '../../entities'
import { UnwrapForTest as OldUnwrapForTest } from '../../types'
import makeFakeProject from '../../__tests__/fixtures/project'
import makeFakeUser from '../../__tests__/fixtures/user'
import {
  LegacyProjectSourced,
  ProjectCompletionDueDateSet,
  ProjectImported,
  ProjectNotified,
} from './events'
import { makeProject } from './Project'

const projectId = new UniqueEntityID('project1')
const appelOffreId = 'Fessenheim'
const periodeId = '2'
const fakeProject = makeFakeProject({ appelOffreId, periodeId, classe: 'Classé' })
const { familleId, numeroCRE } = fakeProject

const appelsOffres = appelsOffreStatic.reduce((map, appelOffre) => {
  map[appelOffre.id] = appelOffre
  return map
}, {})

const fakeHistory: DomainEvent[] = [
  new ProjectImported({
    payload: {
      projectId: projectId.toString(),
      periodeId,
      appelOffreId,
      familleId,
      numeroCRE,
      importId: '',
      data: fakeProject,
    },
    original: {
      occurredAt: new Date(123),
      version: 1,
    },
  }),
  new ProjectNotified({
    payload: {
      projectId: projectId.toString(),
      periodeId,
      appelOffreId,
      familleId,
      candidateEmail: 'test@test.com',
      candidateName: '',
      notifiedOn: 123,
    },
    original: {
      occurredAt: new Date(456),
      version: 1,
    },
  }),
]

describe('Project.setCompletionDueDate()', () => {
  it('should emit a ProjectCompletionDueDateSet', () => {
    const project = UnwrapForTest(makeProject({ projectId, history: fakeHistory, appelsOffres }))

    const newCompletionDueOn = 12345
    const res = project.setCompletionDueDate(newCompletionDueOn)

    expect(res.isOk()).toBe(true)
    if (res.isErr()) return

    expect(project.pendingEvents).not.toHaveLength(0)

    const targetEvent = project.pendingEvents.find(
      (item) => item.type === ProjectCompletionDueDateSet.type
    ) as ProjectCompletionDueDateSet | undefined
    expect(targetEvent).toBeDefined()
    if (!targetEvent) return

    expect(targetEvent.payload.completionDueOn).toEqual(newCompletionDueOn)
    expect(targetEvent.payload.projectId).toEqual(projectId.toString())
    expect(targetEvent.payload.setBy).toEqual('')
  })
})
