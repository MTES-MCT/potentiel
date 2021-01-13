import { UniqueEntityID } from '../../core/domain'
import { UnwrapForTest } from '../../core/utils'
import { appelsOffreStatic } from '../../dataAccess/inMemory/appelOffre'
import { makeUser } from '../../entities'
import { UnwrapForTest as OldUnwrapForTest } from '../../types'
import makeFakeProject from '../../__tests__/fixtures/project'
import makeFakeUser from '../../__tests__/fixtures/user'
import { StoredEvent } from '../eventStore'
import {
  ProjectCertificateGenerated,
  ProjectCertificateRegenerated,
  ProjectCertificateUpdated,
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
describe('Project.lastCertificateUpdate', () => {
  describe('when project never had a certificate', () => {
    it('should return undefined', () => {
      const project = UnwrapForTest(
        makeProject({
          projectId,
          appelsOffres,
          history: fakeHistory.filter(
            (event) =>
              event.type !== ProjectCertificateGenerated.type &&
              event.type !== ProjectCertificateUpdated.type
          ),
        })
      )

      expect(project.lastCertificateUpdate).toBeUndefined()
    })
  })

  describe('when project had a generated certificate', () => {
    it('should return the certificate generated date', () => {
      // Create a project that has not been notified
      const project = UnwrapForTest(
        makeProject({
          projectId,
          appelsOffres,
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
        })
      )

      expect(project.lastCertificateUpdate).toEqual(new Date(456))
    })
  })

  describe('when project had an uploaded certificate', () => {
    it('should return the certificate upload date', () => {
      // Create a project that has not been notified
      const project = UnwrapForTest(
        makeProject({
          projectId,
          appelsOffres,
          history: fakeHistory.concat([
            new ProjectCertificateUpdated({
              payload: {
                projectId: projectId.toString(),
                certificateFileId: 'file1',
                uploadedBy: '',
              },
              original: {
                occurredAt: new Date(456),
                version: 1,
              },
            }),
          ]),
        })
      )

      expect(project.lastCertificateUpdate).toEqual(new Date(456))
    })
  })

  describe('when project had a certificate generated and then regenerated', () => {
    it('should return the certificate regeneration date', () => {
      // Create a project that has not been notified
      const project = UnwrapForTest(
        makeProject({
          projectId,
          appelsOffres,
          history: fakeHistory.concat([
            new ProjectCertificateGenerated({
              payload: {
                projectId: projectId.toString(),
                projectVersionDate: new Date(123),
                certificateFileId: 'file1',
                candidateEmail: '',
                periodeId: '',
                appelOffreId: '',
              },
            }),
            new ProjectCertificateRegenerated({
              payload: {
                projectId: projectId.toString(),
                projectVersionDate: new Date(456),
                certificateFileId: 'file1',
              },
            }),
          ]),
        })
      )

      expect(project.lastCertificateUpdate).toEqual(new Date(456))
    })
  })
})
