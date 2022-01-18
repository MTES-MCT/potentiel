import { DomainEvent, UniqueEntityID } from '@core/domain'
import { UnwrapForTest } from '@core/utils'
import { appelsOffreStatic } from '../../dataAccess/inMemory/appelOffre'
import { makeUser } from '@entities'
import { UnwrapForTest as OldUnwrapForTest } from '../../types'
import makeFakeProject from '../../__tests__/fixtures/project'
import makeFakeUser from '../../__tests__/fixtures/user'
import {
  ProjectCertificateGenerated,
  ProjectCertificateRegenerated,
  ProjectImported,
  ProjectNotified,
} from './events'
import { makeProject } from './Project'

const projectId = new UniqueEntityID('project1')
const appelOffreId = 'Fessenheim'
const periodeId = '2'
const fakeProject = makeFakeProject({ appelOffreId, periodeId, classe: 'Classé' })
const { familleId, numeroCRE, potentielIdentifier } = fakeProject

const fakeUser = OldUnwrapForTest(makeUser(makeFakeUser()))

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
      potentielIdentifier,
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

describe('Project.addGeneratedCertificate()', () => {
  describe('when project did not have a certificate', () => {
    const project = UnwrapForTest(
      makeProject({
        projectId,
        history: fakeHistory,
        appelsOffres,
        buildProjectIdentifier: () => '',
      })
    )

    it('should emit ProjectCertificateGenerated', () => {
      project.addGeneratedCertificate({
        projectVersionDate: new Date(123),
        certificateFileId: 'file1',
      })

      expect(project.pendingEvents).toHaveLength(1)

      const targetEvent = project.pendingEvents.find(
        (item) => item.type === ProjectCertificateGenerated.type
      ) as ProjectCertificateGenerated | undefined
      expect(targetEvent).toBeDefined()
      if (!targetEvent) return

      expect(targetEvent.payload.projectId).toEqual(projectId.toString())
      expect(targetEvent.payload.projectVersionDate).toEqual(new Date(123))
      expect(targetEvent.payload.certificateFileId).toEqual('file1')
    })
  })

  describe('when project already had a certificate', () => {
    const project = UnwrapForTest(
      makeProject({
        projectId,
        history: fakeHistory.concat([
          new ProjectCertificateGenerated({
            payload: {
              projectId: projectId.toString(),
              projectVersionDate: new Date(456),
              certificateFileId: 'file1',
              candidateEmail: '',
              periodeId: '',
              appelOffreId: '',
            },
          }),
        ]),
        appelsOffres,
        buildProjectIdentifier: () => '',
      })
    )

    it('should emit ProjectCertificateRegenerated', () => {
      project.addGeneratedCertificate({
        projectVersionDate: new Date(123),
        certificateFileId: 'file1',
        reason: 'reason',
      })

      expect(project.pendingEvents).toHaveLength(1)

      const targetEvent = project.pendingEvents.find(
        (item) => item.type === ProjectCertificateRegenerated.type
      ) as ProjectCertificateRegenerated | undefined
      expect(targetEvent).toBeDefined()
      if (!targetEvent) return

      expect(targetEvent.payload.projectId).toEqual(projectId.toString())
      expect(targetEvent.payload.projectVersionDate).toEqual(new Date(123))
      expect(targetEvent.payload.certificateFileId).toEqual('file1')
      expect(targetEvent.payload.reason).toEqual('reason')
    })
  })
})
