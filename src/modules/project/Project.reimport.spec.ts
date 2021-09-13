import { UniqueEntityID } from '../../core/domain'
import { UnwrapForTest } from '../../core/utils'
import { appelsOffreStatic } from '../../dataAccess/inMemory/appelOffre'
import makeFakeProject from '../../__tests__/fixtures/project'
import { LegacyProjectSourced, ProjectReimported } from './events'
import { makeProject } from './Project'

const appelsOffres = appelsOffreStatic.reduce((map, appelOffre) => {
  map[appelOffre.id] = appelOffre
  return map
}, {})

const projectId = new UniqueEntityID('project1')
const fakeProject = makeFakeProject({
  classe: 'Classé',
  id: projectId.toString(),
  prixReference: 1,
  evaluationCarbone: 2,
  details: {
    detail1: 'detail1',
    detail2: 'detail2',
  },
})
const { periodeId, appelOffreId, familleId, numeroCRE } = fakeProject

const importId = new UniqueEntityID().toString()

describe('Project.reimport()', () => {
  describe('when the project data has not changed', () => {
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
            },
          }),
        ],
        appelsOffres,
      })
    )

    it('should not emit', () => {
      project.reimport({ data: fakeProject, importId })

      expect(project.pendingEvents).toHaveLength(0)
    })
  })

  describe('when the project data has changed', () => {
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
            },
          }),
        ],
        appelsOffres,
      })
    )
    it('should emit ProjectReimported with the changes in the payload', () => {
      project.reimport({
        data: {
          ...fakeProject,
          prixReference: 3,
          evaluationCarbone: 4,
          details: { detail1: 'changé', detail2: 'detail2' },
        },
        importId,
      })

      const targetEvent = project.pendingEvents.find(
        (item) => item.type === ProjectReimported.type
      ) as ProjectReimported | undefined
      expect(targetEvent).toBeDefined()
      if (!targetEvent) return

      expect(targetEvent.payload.projectId).toEqual(projectId.toString())
      expect(targetEvent.payload.data).toMatchObject({
        prixReference: 3,
        evaluationCarbone: 4,
        details: { detail1: 'changé' },
      })
    })
  })
})
