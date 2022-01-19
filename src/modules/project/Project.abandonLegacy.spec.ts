import { UniqueEntityID } from '@core/domain'
import { UnwrapForTest } from '@core/utils'
import { appelsOffreStatic } from '../../dataAccess/inMemory/appelOffre'
import { makeUser } from '@entities'
import { UnwrapForTest as OldUnwrapForTest } from '../../types'
import makeFakeProject from '../../__tests__/fixtures/project'
import makeFakeUser from '../../__tests__/fixtures/user'
import { EliminatedProjectCannotBeAbandonnedError } from './errors'
import { LegacyProjectSourced, ProjectAbandoned } from './events'
import { makeProject } from './Project'

const projectId = new UniqueEntityID('project1')
const appelOffreId = 'Fessenheim'
const periodeId = '2'
const fakeProject = makeFakeProject({ appelOffreId, periodeId, classe: 'Classé' })
const { familleId, numeroCRE } = fakeProject
const originallyAbandonnedOn = 1234

const fakeUser = OldUnwrapForTest(makeUser(makeFakeUser()))

const appelsOffres = appelsOffreStatic.reduce((map, appelOffre) => {
  map[appelOffre.id] = appelOffre
  return map
}, {})

describe('Project.abandonLegacy()', () => {
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
              potentielIdentifier: '',
            },
          }),
        ],
        appelsOffres,
        buildProjectIdentifier: () => '',
      })
    )

    it('should emit ProjectAbandoned event', () => {
      project.abandonLegacy(originallyAbandonnedOn)

      const targetEvent = project.pendingEvents.find(
        (item) => item.type === ProjectAbandoned.type
      ) as ProjectAbandoned | undefined
      expect(targetEvent).toBeDefined()
      if (!targetEvent) return

      expect(targetEvent.payload.projectId).toEqual(projectId.toString())
      expect(targetEvent.occurredAt).toEqual(new Date(originallyAbandonnedOn))
    })
  })

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
              potentielIdentifier: '',
            },
          }),
        ],
        appelsOffres,
        buildProjectIdentifier: () => '',
      })
    )

    it('should not emit', () => {
      project.abandonLegacy(originallyAbandonnedOn)

      expect(project.pendingEvents.length).toEqual(0)
    })
  })
})
