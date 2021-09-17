import { ProjectImported, ProjectReimported } from '../../project'
import makeFakeProject from '../../../__tests__/fixtures/project'
import { handleProjectImported } from './handleProjetImported'
import { UniqueEntityID } from '../../../core/domain'

describe('authorization handleProjectImported', () => {
  describe('when receiving a ProjectImported event', () => {
    it('should gives rights to the imported project to the user with the same email', async () => {
      const addProjectToUserWithEmail = jest.fn(async (projectId: string, email: string) => null)
      const projectId = new UniqueEntityID().toString()
      const fakeProject = makeFakeProject({ id: projectId, email: 'test@test.test' })

      const { appelOffreId, periodeId, familleId, numeroCRE } = fakeProject

      await handleProjectImported({ addProjectToUserWithEmail })(
        new ProjectImported({
          payload: {
            projectId,
            appelOffreId,
            periodeId,
            familleId,
            numeroCRE,
            importId: '',
            data: fakeProject,
          },
        })
      )

      expect(addProjectToUserWithEmail).toHaveBeenCalledWith(projectId, 'test@test.test')
    })
  })

  describe('when receiving a ProjectReimported event with a changed email', () => {
    it('should gives rights to the project to the user with the same email', async () => {
      const addProjectToUserWithEmail = jest.fn(async (projectId: string, email: string) => null)
      const projectId = new UniqueEntityID().toString()

      await handleProjectImported({ addProjectToUserWithEmail })(
        new ProjectReimported({
          payload: {
            projectId,
            importId: '',
            data: { email: 'test@test.test' },
          },
        })
      )

      expect(addProjectToUserWithEmail).toHaveBeenCalledWith(projectId, 'test@test.test')
    })
  })
})
