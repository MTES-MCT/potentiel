import { UniqueEntityID } from '../../core/domain'
import { UnwrapForTest } from '../../core/utils'
import { appelsOffreStatic } from '../../dataAccess/inMemory/appelOffre'
import { makeUser } from '../../entities'
import { UnwrapForTest as OldUnwrapForTest } from '../../types'
import makeFakeProject from '../../__tests__/fixtures/project'
import makeFakeUser from '../../__tests__/fixtures/user'
import {
  LegacyProjectSourced,
  ProjectDataCorrected,
  ProjectImported,
  ProjectReimported,
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
        appelsOffres,
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
        appelsOffres,
        buildProjectIdentifier: () => '',
      })
    )

    it('should return the appel offre of the import event', () => {
      expect(project.appelOffre?.id).toEqual(appelOffreId)
      expect(project.appelOffre?.periode.id).toEqual(periodeId)
    })
  })
})
