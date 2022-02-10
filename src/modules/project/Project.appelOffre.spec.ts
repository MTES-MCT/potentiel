import { UniqueEntityID } from '@core/domain'
import { UnwrapForTest } from '@core/utils'
import { appelsOffreStatic } from '@dataAccess/inMemory'
import makeFakeProject from '../../__tests__/fixtures/project'
import { LegacyProjectSourced, ProjectImported } from './events'
import { makeProject } from './Project'
import { makeGetProjectAppelOffre } from '@modules/projectAppelOffre'

const projectId = new UniqueEntityID('project1')
const appelOffreId = 'Fessenheim'
const periodeId = '2'
const fakeProject = makeFakeProject({ appelOffreId, periodeId, classe: 'Classé' })
const { familleId, numeroCRE, potentielIdentifier } = fakeProject

const getProjectAppelOffre = makeGetProjectAppelOffre(appelsOffreStatic)

describe('Project.appelOffre', () => {
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
              content: fakeProject,
              potentielIdentifier: '',
            },
          }),
        ],
        getProjectAppelOffre,
        buildProjectIdentifier: () => '',
      })
    )

    it('should return the appel offre of the source event', () => {
      expect(project.appelOffre?.id).toEqual(appelOffreId)
      expect(project.appelOffre?.periode.id).toEqual(periodeId)
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
              data: fakeProject,
              potentielIdentifier,
            },
          }),
        ],
        getProjectAppelOffre,
        buildProjectIdentifier: () => '',
      })
    )

    it('should return the appel offre of the import event', () => {
      expect(project.appelOffre?.id).toEqual(appelOffreId)
      expect(project.appelOffre?.periode.id).toEqual(periodeId)
    })
  })
})
