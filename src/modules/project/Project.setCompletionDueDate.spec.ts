import { UniqueEntityID } from '../../core/domain'
import { logger, UnwrapForTest } from '../../core/utils'
import { appelsOffreStatic } from '../../dataAccess/inMemory/appelOffre'
import { makeUser } from '../../entities'
import { UnwrapForTest as OldUnwrapForTest } from '../../types'
import makeFakeProject from '../../__tests__/fixtures/project'
import makeFakeUser from '../../__tests__/fixtures/user'
import { StoredEvent } from '../eventStore'
import { IllegalProjectDataError, ProjectCannotBeUpdatedIfUnnotifiedError } from './errors'
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

const fakeUser = OldUnwrapForTest(makeUser(makeFakeUser()))

const appelsOffres = appelsOffreStatic.reduce((map, appelOffre) => {
  map[appelOffre.id] = appelOffre
  return map
}, {})

const makeFakeHistory = (fakeProject: any): StoredEvent[] => {
  return [
    new LegacyProjectSourced({
      payload: {
        projectId: projectId.toString(),
        periodeId: fakeProject.periodeId,
        appelOffreId: fakeProject.appelOffreId,
        familleId: fakeProject.familleId,
        numeroCRE: fakeProject.numeroCRE,
        content: fakeProject,
      },
    }),
  ]
}

const fakeHistory: StoredEvent[] = [
  new ProjectImported({
    payload: {
      projectId: projectId.toString(),
      periodeId,
      appelOffreId,
      familleId,
      numeroCRE,
      importedBy: fakeUser.id,
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
  describe('when project is classé', () => {
    const fakeProjectData = makeFakeProject({ notifiedOn: 123, classe: 'Classé' })
    const fakeHistory = makeFakeHistory(fakeProjectData)

    it('should emit a ProjectCompletionDueDateSet', () => {
      const project = UnwrapForTest(makeProject({ projectId, history: fakeHistory, appelsOffres }))

      const newCompletionDueOn = 12345

      const res = project.setCompletionDueDate(fakeUser, newCompletionDueOn)

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
      expect(targetEvent.payload.setBy).toEqual(fakeUser.id)
    })
  })

  describe('when project is éliminé', () => {
    const fakeProjectData = makeFakeProject({ notifiedOn: 123, classe: 'Eliminé' })
    const fakeHistory = makeFakeHistory(fakeProjectData)

    it('should not trigger ProjectCompletionDueDateSet', () => {
      const project = UnwrapForTest(makeProject({ projectId, history: fakeHistory, appelsOffres }))
      const res = project.setCompletionDueDate(fakeUser, 1234)

      if (res.isErr()) logger.error(res.error)
      expect(res.isOk()).toBe(true)
      if (res.isErr()) return

      const targetEvent = project.pendingEvents.find(
        (item) => item.type === ProjectCompletionDueDateSet.type
      ) as ProjectCompletionDueDateSet | undefined
      expect(targetEvent).not.toBeDefined()
    })
  })

  describe('when project is not notified', () => {
    it('should return a ProjectCannotBeUpdatedIfUnnotifiedError', () => {
      // Create a project that has not been notified
      const project = UnwrapForTest(
        makeProject({
          projectId,
          appelsOffres,
          history: fakeHistory.filter((event) => event.type !== ProjectNotified.type),
        })
      )

      const res = project.setCompletionDueDate(fakeUser, 1)

      expect(res.isErr()).toEqual(true)
      if (res.isOk()) return
      expect(res.error).toBeInstanceOf(ProjectCannotBeUpdatedIfUnnotifiedError)
    })
  })

  describe('when new completion due date is before notification date', () => {
    it('should return a IllegalProjectDataError', () => {
      const fakeProjectData = makeFakeProject({ notifiedOn: 1001, classe: 'Classé' })
      const fakeHistory = makeFakeHistory(fakeProjectData)
      const project = UnwrapForTest(makeProject({ projectId, history: fakeHistory, appelsOffres }))

      const res = project.setCompletionDueDate(fakeUser, 1000)

      expect(res.isErr()).toEqual(true)
      if (res.isOk()) return
      expect(res.error).toBeInstanceOf(IllegalProjectDataError)
    })
  })
})
