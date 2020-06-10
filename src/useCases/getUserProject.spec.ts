import makeGetUserProject from './getUserProject'
import makeShouldUserAccessProject from './shouldUserAccessProject'

import makeFakeProject from '../__tests__/fixtures/project'
import makeFakeUser from '../__tests__/fixtures/user'

import { projectRepo, userRepo } from '../dataAccess/inMemory'
import { makeProject, makeUser } from '../entities'

const shouldUserAccessProject = makeShouldUserAccessProject({
  userRepo,
  projectRepo,
})
const getUserProject = makeGetUserProject({
  projectRepo,
  shouldUserAccessProject,
})

describe('getUserProject use-case', () => {
  it('should return the project if the user is admin', async () => {
    const userResult = makeUser(makeFakeUser({ role: 'admin' }))
    expect(userResult.is_ok()).toBeTruthy()
    if (userResult.is_err()) return
    const user = userResult.unwrap()
    await userRepo.insert(user)

    const fakeProjectResult = makeProject(makeFakeProject({ notifiedOn: 0 }))
    expect(fakeProjectResult.is_ok()).toBeTruthy()
    if (fakeProjectResult.is_err()) return
    const fakeProject = fakeProjectResult.unwrap()

    await projectRepo.save(fakeProject)

    const projectResult = await getUserProject({
      user,
      projectId: fakeProject.id,
    })

    expect(projectResult).toEqual(expect.objectContaining(fakeProject))
  })

  it('should return the project if the user has rights on this project', async () => {
    const userResult = makeUser(makeFakeUser({ role: 'porteur-projet' }))
    expect(userResult.is_ok()).toBeTruthy()
    if (userResult.is_err()) return
    const user = userResult.unwrap()
    await userRepo.insert(user)

    const fakeProjectResult = makeProject(makeFakeProject({ notifiedOn: 1234 }))
    expect(fakeProjectResult.is_ok()).toBeTruthy()
    if (fakeProjectResult.is_err()) return
    const fakeProject = fakeProjectResult.unwrap()

    await projectRepo.save(fakeProject)

    // Associate this user to this project
    await userRepo.addProject(user.id, fakeProject.id)

    const projectResult = await getUserProject({
      user,
      projectId: fakeProject.id,
    })

    expect(projectResult).toEqual(expect.objectContaining(fakeProject))
  })

  it('should return null if the user has rights on this project but it is not notified', async () => {
    const userResult = makeUser(makeFakeUser({ role: 'porteur-projet' }))
    expect(userResult.is_ok()).toBeTruthy()
    if (userResult.is_err()) return
    const user = userResult.unwrap()
    await userRepo.insert(user)

    const fakeProjectResult = makeProject(makeFakeProject({ notifiedOn: 0 }))
    expect(fakeProjectResult.is_ok()).toBeTruthy()
    if (fakeProjectResult.is_err()) return
    const fakeProject = fakeProjectResult.unwrap()

    await projectRepo.save(fakeProject)

    // Associate this user to this project
    await userRepo.addProject(user.id, fakeProject.id)

    const projectResult = await getUserProject({
      user,
      projectId: fakeProject.id,
    })

    expect(projectResult).toEqual(null)
  })

  it('should return null if the user has no rights on this project', async () => {
    const userResult = makeUser(makeFakeUser({ role: 'porteur-projet' }))
    expect(userResult.is_ok()).toBeTruthy()
    if (userResult.is_err()) {
      console.log('userResult fail', userResult.unwrap_err())
    }
    const user = userResult.unwrap()
    await userRepo.insert(user)

    const fakeProjectResult = makeProject(makeFakeProject())
    expect(fakeProjectResult.is_ok()).toBeTruthy()
    if (fakeProjectResult.is_err()) return
    const fakeProject = fakeProjectResult.unwrap()

    await projectRepo.save(fakeProject)

    // Do not associate this user to this project

    const projectResult = await getUserProject({
      user,
      projectId: fakeProject.id,
    })

    expect(projectResult).toEqual(null)
  })
})
