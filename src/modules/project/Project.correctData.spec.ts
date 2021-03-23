import { DomainEvent, UniqueEntityID } from '../../core/domain'
import { UnwrapForTest } from '../../core/utils'
import { appelsOffreStatic } from '../../dataAccess/inMemory/appelOffre'
import { makeUser } from '../../entities'
import { UnwrapForTest as OldUnwrapForTest } from '../../types'
import makeFakeProject from '../../__tests__/fixtures/project'
import makeFakeUser from '../../__tests__/fixtures/user'
import { IllegalProjectDataError, ProjectCannotBeUpdatedIfUnnotifiedError } from './errors'
import {
  LegacyProjectSourced,
  ProjectDataCorrected,
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

const makeFakeHistory = (fakeProject: any): DomainEvent[] => {
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

const fakeHistory: DomainEvent[] = [
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

describe('Project.correctData()', () => {
  it('should emit ProjectDataCorrected with the delta between present Project and passed data', () => {
    const project = UnwrapForTest(makeProject({ projectId, history: fakeHistory, appelsOffres }))

    const res = project.correctData(fakeUser, {
      numeroCRE: '1',
      nomCandidat: fakeProject.nomCandidat, // Unchanged, should be ignored
    })

    expect(res.isOk()).toBe(true)
    if (res.isErr()) return

    expect(project.pendingEvents).not.toHaveLength(0)

    const targetEvent = project.pendingEvents.find(
      (item) => item.type === ProjectDataCorrected.type
    ) as ProjectDataCorrected | undefined
    expect(targetEvent).toBeDefined()
    if (!targetEvent) return

    expect(targetEvent.payload.correctedData).toEqual({
      numeroCRE: '1',
    })
    expect(targetEvent.payload.projectId).toEqual(projectId.toString())
    expect(targetEvent.payload.correctedBy).toEqual(fakeUser.id)
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

      const res = project.correctData(fakeUser, {
        numeroCRE: '1',
      })

      expect(res.isErr()).toEqual(true)
      if (res.isOk()) return
      expect(res.error).toBeInstanceOf(ProjectCannotBeUpdatedIfUnnotifiedError)
    })
  })

  describe('when passed erroneous data', () => {
    const project = UnwrapForTest(makeProject({ projectId, history: fakeHistory, appelsOffres }))

    it('should return an IllegalProjectDataError', () => {
      const res = project.correctData(fakeUser, {
        puissance: -1,
      })
      expect(res.isErr()).toBe(true)
      if (res.isOk()) return

      expect(res.error).toBeInstanceOf(IllegalProjectDataError)

      const error = res.error as IllegalProjectDataError
      expect(error.errorsInFields).toHaveProperty('puissance')
    })
  })

  describe('when passed a familleId that does not exist in the appelOffre', () => {
    const fakeProjectData = makeFakeProject({ notifiedOn: 123, appelOffreId: 'Fessenheim' })
    const fakeHistory = makeFakeHistory(fakeProjectData)
    const project = UnwrapForTest(makeProject({ projectId, history: fakeHistory, appelsOffres }))

    it('should return an IllegalProjectDataError', () => {
      const res = project.correctData(fakeUser, {
        familleId: 'abc',
      })
      expect(res.isErr()).toBe(true)
      if (res.isOk()) return

      expect(res.error).toBeInstanceOf(IllegalProjectDataError)

      const error = res.error as IllegalProjectDataError
      expect(error.errorsInFields).toHaveProperty('familleId')
    })
  })
})
