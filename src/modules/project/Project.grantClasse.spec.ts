import { UniqueEntityID } from '../../core/domain'
import { UnwrapForTest } from '../../core/utils'
import { appelsOffreStatic } from '../../dataAccess/inMemory/appelOffre'
import { makeUser } from '../../entities'
import { UnwrapForTest as OldUnwrapForTest } from '../../types'
import makeFakeProject from '../../__tests__/fixtures/project'
import makeFakeUser from '../../__tests__/fixtures/user'
import {
  LegacyProjectSourced,
  ProjectClasseGranted,
  ProjectCompletionDueDateSet,
  ProjectDCRDueDateSet,
  ProjectGFDueDateSet,
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

describe('Project.grantClasse()', () => {
  describe('when project is Eliminé', () => {
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
            },
          }),
        ],
        appelsOffres,
      })
    )

    it('should emit ProjectClasseGranted event', () => {
      project.grantClasse(fakeUser)

      const targetEvent = project.pendingEvents.find(
        (item) => item.type === ProjectClasseGranted.type
      ) as ProjectClasseGranted | undefined
      expect(targetEvent).toBeDefined()
      if (!targetEvent) return

      expect(targetEvent.payload.projectId).toEqual(projectId.toString())
      expect(targetEvent.payload.grantedBy).toEqual(fakeUser.id)
    })
  })

  describe('when project is Classé', () => {
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
              content: { ...fakeProject, classe: 'Classé' },
            },
          }),
        ],
        appelsOffres,
      })
    )

    it('not emit', () => {
      project.grantClasse(fakeUser)

      expect(project.pendingEvents).toHaveLength(0)
    })
  })
})
