import { DomainEvent, UniqueEntityID } from '../../core/domain'
import { UnwrapForTest } from '../../core/utils'
import { appelsOffreStatic } from '../../dataAccess/inMemory/appelOffre'
import { makeUser } from '../../entities'
import { UnwrapForTest as OldUnwrapForTest } from '../../types'
import makeFakeProject from '../../__tests__/fixtures/project'
import makeFakeUser from '../../__tests__/fixtures/user'
import { ProjectCannotBeUpdatedIfUnnotifiedError } from './errors'
import { ProjectCertificateUpdated, ProjectImported, ProjectNotified } from './events'
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

const fakeHistory: DomainEvent[] = [
  new ProjectImported({
    payload: {
      projectId: projectId.toString(),
      potentielIdentifier: '',
      periodeId,
      appelOffreId,
      familleId,
      numeroCRE,
      importId: '',
      data: fakeProject,
    },
    original: {
      occurredAt: new Date(123),
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
    },
  }),
]

describe('Project.updateCertificate()', () => {
  it('should emit ProjectCertificateUpdated', () => {
    const project = UnwrapForTest(
      makeProject({
        projectId,
        history: fakeHistory,
        appelsOffres,
        buildProjectIdentifier: () => '',
      })
    )

    const res = project.updateCertificate(fakeUser, 'fakeFileId')

    expect(res.isOk()).toBe(true)
    if (res.isErr()) return

    expect(project.pendingEvents).not.toHaveLength(0)

    const targetEvent = project.pendingEvents.find(
      (item) => item.type === ProjectCertificateUpdated.type
    ) as ProjectCertificateUpdated | undefined
    expect(targetEvent).toBeDefined()
    if (!targetEvent) return

    expect(targetEvent.payload.certificateFileId).toEqual('fakeFileId')
    expect(targetEvent.payload.projectId).toEqual(projectId.toString())
    expect(targetEvent.payload.uploadedBy).toEqual(fakeUser.id)
  })

  describe('when project is not notified', () => {
    it('should return a ProjectCannotBeUpdatedIfUnnotifiedError', () => {
      // Create a project that has not been notified
      const project = UnwrapForTest(
        makeProject({
          projectId,
          appelsOffres,
          history: fakeHistory.filter((event) => event.type !== ProjectNotified.type),
          buildProjectIdentifier: () => '',
        })
      )

      const res = project.updateCertificate(fakeUser, 'fakeFileId')

      expect(res.isErr()).toEqual(true)
      if (res.isOk()) return
      expect(res.error).toBeInstanceOf(ProjectCannotBeUpdatedIfUnnotifiedError)
    })
  })
})
