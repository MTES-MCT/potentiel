import { UniqueEntityID } from '@core/domain'
import { UnwrapForTest } from '@core/utils'
import { appelsOffreStatic } from '@dataAccess/inMemory'
import { makeUser } from '@entities'
import { UnwrapForTest as OldUnwrapForTest } from '../../types'
import makeFakeProject from '../../__tests__/fixtures/project'
import makeFakeUser from '../../__tests__/fixtures/user'
import { LegacyProjectSourced, ProjectClasseGranted } from './events'
import { makeProject } from './Project'
import { makeGetProjectAppelOffre } from '@modules/projectAppelOffre'

const projectId = new UniqueEntityID('project1')
const appelOffreId = 'Fessenheim'
const periodeId = '2'
const fakeProject = makeFakeProject({ appelOffreId, periodeId, classe: 'Classé' })
const { familleId, numeroCRE } = fakeProject

const fakeUser = OldUnwrapForTest(makeUser(makeFakeUser()))

const getProjectAppelOffre = makeGetProjectAppelOffre(appelsOffreStatic)

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
              potentielIdentifier: '',
            },
          }),
        ],
        getProjectAppelOffre,
        buildProjectIdentifier: () => '',
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
              potentielIdentifier: '',
            },
          }),
        ],
        getProjectAppelOffre,
        buildProjectIdentifier: () => '',
      })
    )

    it('not emit', () => {
      project.grantClasse(fakeUser)

      expect(project.pendingEvents).toHaveLength(0)
    })
  })
})
