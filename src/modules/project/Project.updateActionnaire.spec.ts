import { UniqueEntityID } from '../../core/domain'
import { UnwrapForTest } from '../../core/utils'
import { appelsOffreStatic } from '../../dataAccess/inMemory/appelOffre'
import { makeUser } from '../../entities'
import { UnwrapForTest as OldUnwrapForTest } from '../../types'
import makeFakeProject from '../../__tests__/fixtures/project'
import makeFakeUser from '../../__tests__/fixtures/user'
import { ProjectCannotBeUpdatedIfUnnotifiedError } from './errors'
import { LegacyProjectSourced, ProjectActionnaireUpdated } from './events'
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

const newActionnaire = 'newActionnaire'

describe('Project.updateActionnaire()', () => {
  describe('when project has been notified', () => {
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
              content: { ...fakeProject, notifiedOn: 1 },
            },
          }),
        ],
        appelsOffres,
      })
    )

    it('should emit a ProjectActionnaireUpdated event', () => {
      project.updateActionnaire(fakeUser, newActionnaire)

      const targetEvent = project.pendingEvents.find(
        (item) => item.type === ProjectActionnaireUpdated.type
      ) as ProjectActionnaireUpdated | undefined
      expect(targetEvent).toBeDefined()
      if (!targetEvent) return

      expect(targetEvent.payload.projectId).toEqual(projectId.toString())
      expect(targetEvent.payload.updatedBy).toEqual(fakeUser.id)
      expect(targetEvent.payload.newActionnaire).toEqual(newActionnaire)
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
              periodeId,
              appelOffreId,
              familleId,
              numeroCRE,
              content: { ...fakeProject, notifiedOn: 0 },
            },
          }),
        ],
        appelsOffres,
      })
    )

    it('should return ProjectCannotBeUpdatedIfUnnotifiedError', () => {
      const res = project.updateActionnaire(fakeUser, newActionnaire)
      expect(res._unsafeUnwrapErr()).toBeInstanceOf(ProjectCannotBeUpdatedIfUnnotifiedError)
      expect(project.pendingEvents.length).toEqual(0)
    })
  })
})
