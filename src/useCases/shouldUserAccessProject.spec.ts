import makeShouldUserAccessProject from './shouldUserAccessProject'

import makeFakeProject from '../__tests__/fixtures/project'
import makeFakeUser from '../__tests__/fixtures/user'

import { projectRepo, userRepo } from '../dataAccess/inMemory'
import { User, makeProject, makeUser } from '../entities'

const shouldUserAccessProject = makeShouldUserAccessProject({
  userRepo,
  projectRepo,
})

describe('shouldUserAccessProject use-case', () => {
  it('should return true if the user is admin', async () => {
    const userResult = makeUser(makeFakeUser({ role: 'admin' }))
    expect(userResult.is_ok()).toBeTruthy()
    if (userResult.is_err()) return
    const user = userResult.unwrap()
    await userRepo.insert(user)

    const fakeProjectResult = makeProject(makeFakeProject())
    expect(fakeProjectResult.is_ok()).toBeTruthy()
    if (fakeProjectResult.is_err()) return
    const fakeProject = fakeProjectResult.unwrap()

    await projectRepo.save(fakeProject)

    const access = await shouldUserAccessProject({
      user,
      projectId: fakeProject.id,
    })

    expect(access).toEqual(true)
  })

  describe('user is dreal', () => {
    let user: User
    beforeAll(async () => {
      const userResult = makeUser(makeFakeUser({ role: 'dreal' }))
      expect(userResult.is_ok()).toBeTruthy()
      if (userResult.is_err()) return
      user = userResult.unwrap()
      await userRepo.insert(user)

      await userRepo.addToDreal(user.id, 'Corse')
    })

    it('should return true if the project region coincides with user dreal', async () => {
      const fakeProjectResult = makeProject(
        makeFakeProject({ regionProjet: 'Corse / Bretagne' })
      )
      expect(fakeProjectResult.is_ok()).toBeTruthy()
      if (fakeProjectResult.is_err()) return
      const fakeProject = fakeProjectResult.unwrap()

      await projectRepo.save(fakeProject)

      const access = await shouldUserAccessProject({
        user,
        projectId: fakeProject.id,
      })

      expect(access).toEqual(true)
    })

    it('should return false if the project region does not coincide with user dreal', async () => {
      const fakeProjectResult = makeProject(
        makeFakeProject({ regionProjet: 'Bretagne' })
      )
      expect(fakeProjectResult.is_ok()).toBeTruthy()
      if (fakeProjectResult.is_err()) return
      const fakeProject = fakeProjectResult.unwrap()

      await projectRepo.save(fakeProject)

      const access = await shouldUserAccessProject({
        user,
        projectId: fakeProject.id,
      })

      expect(access).toEqual(false)
    })
  })

  describe('user is porteur-projet', () => {
    let user: User
    beforeAll(async () => {
      const userResult = makeUser(makeFakeUser({ role: 'porteur-projet' }))
      expect(userResult.is_ok()).toBeTruthy()
      if (userResult.is_err()) return
      user = userResult.unwrap()
      await userRepo.insert(user)
    })

    it('should return true if the user has rights on this project', async () => {
      const fakeProjectResult = makeProject(makeFakeProject())
      expect(fakeProjectResult.is_ok()).toBeTruthy()
      if (fakeProjectResult.is_err()) return
      const fakeProject = fakeProjectResult.unwrap()

      await projectRepo.save(fakeProject)

      // Associate this user to this project
      await userRepo.addProject(user.id, fakeProject.id)

      const access = await shouldUserAccessProject({
        user,
        projectId: fakeProject.id,
      })

      expect(access).toEqual(true)
    })

    it('should return false if the user has no rights on this project', async () => {
      const fakeProjectResult = makeProject(makeFakeProject())
      expect(fakeProjectResult.is_ok()).toBeTruthy()
      if (fakeProjectResult.is_err()) return
      const fakeProject = fakeProjectResult.unwrap()

      await projectRepo.save(fakeProject)

      // Do not associate this user to this project

      const access = await shouldUserAccessProject({
        user,
        projectId: fakeProject.id,
      })

      expect(access).toEqual(false)
    })
  })
})
