import { UniqueEntityID } from '@core/domain'
import { UnwrapForTest } from '@core/utils'
import { appelsOffreStatic } from '@dataAccess/inMemory'
import makeFakeProject from '../../__tests__/fixtures/project'
import { LegacyProjectSourced, ProjectImported, ProjectReimported } from './events'
import { makeProject } from './Project'
import { makeGetProjectAppelOffre } from '@modules/projectAppelOffre'

const projectId = new UniqueEntityID('project1')
const appelOffreId = 'Fessenheim'
const periodeId = '2'
const fakeProject = makeFakeProject({ appelOffreId, periodeId, classe: 'Classé' })
const { familleId, numeroCRE, potentielIdentifier } = fakeProject

const getProjectAppelOffre = makeGetProjectAppelOffre(appelsOffreStatic)

describe('Project.isClasse', () => {
  describe('when project has a legacy source', () => {
    const project = UnwrapForTest(
      makeProject({
        projectId,
        history: [
          new LegacyProjectSourced({
            payload: {
              projectId: projectId.toString(),
              periodeId,
              appelOffreId,
              familleId,
              numeroCRE,
              content: { ...fakeProject, classe: 'Eliminé' },
              potentielIdentifier: '',
            },
          }),
        ],
        getProjectAppelOffre,
        buildProjectIdentifier: () => '',
      })
    )

    it('should return the classe of the source event', () => {
      expect(project.isClasse).toEqual(false)
    })
  })

  describe('when project has just been imported', () => {
    const project = UnwrapForTest(
      makeProject({
        projectId,
        history: [
          new ProjectImported({
            payload: {
              projectId: projectId.toString(),
              periodeId,
              appelOffreId,
              familleId,
              numeroCRE,
              importId: '',
              data: { ...fakeProject, classe: 'Classé' },
              potentielIdentifier,
            },
          }),
        ],
        getProjectAppelOffre,
        buildProjectIdentifier: () => '',
      })
    )

    it('should return the classe of the import event', () => {
      expect(project.isClasse).toEqual(true)
    })
  })

  describe('when project has just been reimported with a different classe', () => {
    const project = UnwrapForTest(
      makeProject({
        projectId,
        history: [
          new ProjectImported({
            payload: {
              projectId: projectId.toString(),
              periodeId,
              appelOffreId,
              familleId,
              numeroCRE,
              importId: '',
              data: { ...fakeProject, classe: 'Classé' },
              potentielIdentifier,
            },
          }),
          new ProjectReimported({
            payload: {
              projectId: projectId.toString(),
              importId: '',
              periodeId,
              appelOffreId,
              data: { ...fakeProject, classe: 'Eliminé' },
            },
          }),
        ],
        getProjectAppelOffre,
        buildProjectIdentifier: () => '',
      })
    )

    it('should return the classe of the reimport event', () => {
      expect(project.isClasse).toEqual(false)
    })
  })
})
