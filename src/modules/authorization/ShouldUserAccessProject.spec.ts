import { ShouldUserAccessProject } from './ShouldUserAccessProject'

import makeFakeProject from '../../__tests__/fixtures/project'
import makeFakeUser from '../../__tests__/fixtures/user'

import { userRepo } from '../../dataAccess/inMemory'
import { User, makeProject, makeUser, Project } from '../../entities'

describe('ShouldUserAccessProject', () => {
  describe('given user is admin', () => {
    const findProjectById = jest.fn()
    const shouldUserAccessProject = new ShouldUserAccessProject(
      userRepo,
      findProjectById
    )

    it('should return true', async () => {
      const user = makeFakeUser({
        role: 'admin',
      })

      const access = await shouldUserAccessProject.check({
        user,
        projectId: 'project1',
      })

      expect(access).toEqual(true)
      expect(findProjectById).not.toHaveBeenCalled()
    })
  })

  describe('given user is dgec', () => {
    const findProjectById = jest.fn()
    const shouldUserAccessProject = new ShouldUserAccessProject(
      userRepo,
      findProjectById
    )

    it('should return true', async () => {
      const user = makeFakeUser({
        role: 'dgec',
      })

      const access = await shouldUserAccessProject.check({
        user,
        projectId: 'project1',
      })

      expect(access).toEqual(true)
      expect(findProjectById).not.toHaveBeenCalled()
    })
  })

  describe('given user is dreal', () => {
    let user: User
    beforeAll(async () => {
      const userResult = makeUser(makeFakeUser({ role: 'dreal' }))
      expect(userResult.is_ok()).toBeTruthy()
      if (userResult.is_err()) return
      user = userResult.unwrap()
      await userRepo.insert(user)

      await userRepo.addToDreal(user.id, 'Corse')
    })

    describe('given the project is in the dreal region', () => {
      const findProjectById = jest.fn(
        async () =>
          ({
            regionProjet: 'Corse',
          } as Project)
      )
      const shouldUserAccessProject = new ShouldUserAccessProject(
        userRepo,
        findProjectById
      )

      it('should return true', async () => {
        const access = await shouldUserAccessProject.check({
          user,
          projectId: 'project1',
        })

        expect(access).toEqual(true)
        expect(findProjectById).toHaveBeenCalledWith('project1')
      })
    })

    describe('given the project is not in the dreal region', () => {
      const findProjectById = jest.fn(
        async () =>
          ({
            regionProjet: 'Bretagne',
          } as Project)
      )
      const shouldUserAccessProject = new ShouldUserAccessProject(
        userRepo,
        findProjectById
      )

      it('should return false', async () => {
        const access = await shouldUserAccessProject.check({
          user,
          projectId: 'project1',
        })

        expect(access).toEqual(false)
        expect(findProjectById).toHaveBeenCalledWith('project1')
      })
    })
  })

  describe('given user is porteur-projet', () => {
    let user: User

    const findProjectById = jest.fn(async () => {
      throw 'do not call'
    })
    const shouldUserAccessProject = new ShouldUserAccessProject(
      userRepo,
      findProjectById
    )

    beforeAll(async () => {
      const userResult = makeUser(makeFakeUser({ role: 'porteur-projet' }))
      expect(userResult.is_ok()).toBeTruthy()
      if (userResult.is_err()) return
      user = userResult.unwrap()
      await userRepo.insert(user)
    })

    it('should return true if the user has rights on this project', async () => {
      // Associate this user to this project
      const projectId = 'project1'
      await userRepo.addProject(user.id, projectId)

      const access = await shouldUserAccessProject.check({
        user,
        projectId: projectId,
      })

      expect(access).toEqual(true)
    })

    it('should return false if the user has no rights on this project', async () => {
      const projectId = 'project2'

      const access = await shouldUserAccessProject.check({
        user,
        projectId: projectId,
      })

      expect(access).toEqual(false)
    })
  })
})
