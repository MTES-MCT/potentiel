import { UniqueEntityID } from '@core/domain'
import { UnwrapForTest } from '@core/utils'
import { appelsOffreStatic } from '@dataAccess/inMemory'
import makeFakeProject from '../../__tests__/fixtures/project'
import { ProjectNotEligibleForCertificateError } from './errors'
import { LegacyProjectSourced } from './events'
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

describe('certificateData', () => {
  it('should return template and certificate data', () => {
    const project = UnwrapForTest(
      makeProject({
        projectId,
        history: [
          new LegacyProjectSourced({
            payload: {
              projectId: projectId.toString(),
              periodeId: '2',
              appelOffreId: 'Fessenheim',
              familleId,
              numeroCRE,
              content: { ...fakeProject, notifiedOn: 123 },
              potentielIdentifier: '',
            },
          }),
        ],
        appelsOffres,
        buildProjectIdentifier: () => '',
      })
    )

    expect(project.certificateData.isOk()).toBe(true)
    if (project.certificateData.isErr()) return

    // Check a few fields
    expect(project.certificateData.value.data.notifiedOn).toEqual(123)
    expect(project.certificateData.value.data.appelOffre.id).toEqual('Fessenheim')
    expect(project.certificateData.value.data.familleId).toEqual(familleId)
  })

  describe('when project periode is not eligible to certificate', () => {
    const project = UnwrapForTest(
      makeProject({
        projectId,
        history: [
          new LegacyProjectSourced({
            payload: {
              projectId: projectId.toString(),
              periodeId: '1',
              appelOffreId: 'Fessenheim',
              familleId,
              numeroCRE,
              content: { ...fakeProject, notifiedOn: 123 },
              potentielIdentifier: '',
            },
          }),
        ],
        appelsOffres,
        buildProjectIdentifier: () => '',
      })
    )

    it('should return ProjectNotEligibileForCertificateError', () => {
      expect(project.certificateData.isErr()).toBe(true)
      if (project.certificateData.isOk()) return
      expect(project.certificateData.error).toBeInstanceOf(ProjectNotEligibleForCertificateError)
    })
  })

  describe('when project has not been notified', () => {
    const project = UnwrapForTest(
      makeProject({
        projectId,
        history: [
          new LegacyProjectSourced({
            payload: {
              projectId: projectId.toString(),
              periodeId: '2',
              appelOffreId: 'Fessenheim',
              familleId,
              numeroCRE,
              content: { ...fakeProject, notifiedOn: 0 },
              potentielIdentifier: '',
            },
          }),
        ],
        appelsOffres,
        buildProjectIdentifier: () => '',
      })
    )

    it('should return ProjectNotEligibileForCertificateError', () => {
      expect(project.certificateData.isErr()).toBe(true)
      if (project.certificateData.isOk()) return
      expect(project.certificateData.error).toBeInstanceOf(ProjectNotEligibleForCertificateError)
    })
  })
})
