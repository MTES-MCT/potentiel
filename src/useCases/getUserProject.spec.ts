import { makeProject, User } from '../entities'
import { UnwrapForTest } from '../types'
import makeFakeProject from '../__tests__/fixtures/project'
import makeGetUserProject from './getUserProject'

describe('getUserProject use-case', () => {
  const project = UnwrapForTest(makeProject(makeFakeProject()))

  describe('given the user has rights to the project', () => {
    const shouldUserAccessProject = jest.fn(async () => true)
    const findProjectById = jest.fn(async () => project)
    const getUserProject = makeGetUserProject({
      findProjectById,
      shouldUserAccessProject,
    })

    it('should return the project', async () => {
      const user = {
        id: 'user1',
      } as User
      const projectId = 'project1'
      const res = await getUserProject({
        user,
        projectId,
      })

      expect(res).toEqual(project)

      expect(shouldUserAccessProject).toHaveBeenCalledWith({ user, projectId })
      expect(findProjectById).toHaveBeenCalledWith(projectId)
    })
  })

  describe('given the user doesnt have rights to the project', () => {
    const shouldUserAccessProject = jest.fn(async () => false)
    const findProjectById = jest.fn()
    const getUserProject = makeGetUserProject({
      findProjectById,
      shouldUserAccessProject,
    })

    it('should return null', async () => {
      const user = {
        id: 'user1',
      } as User
      const projectId = 'project1'
      const res = await getUserProject({
        user,
        projectId,
      })

      expect(res).toEqual(null)

      expect(shouldUserAccessProject).toHaveBeenCalledWith({ user, projectId })
      expect(findProjectById).not.toHaveBeenCalled()
    })
  })
})
