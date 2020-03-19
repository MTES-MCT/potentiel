import makeListUserProjects from './listUserProjects'

import makeFakeUser from '../__tests__/fixtures/user'
import makeFakeProject from '../__tests__/fixtures/project'
import { makeUser, makeProject } from '../entities'
import { userRepo } from '../dataAccess/inMemory'
import { projectRepo } from '../dataAccess/inMemory'

const listUserProjects = makeListUserProjects({ projectRepo })

describe('listUserProjects use-case', () => {
  let user
  let userProject
  beforeAll(async () => {
    // Create a user
    const fakeUserResult = makeUser(makeFakeUser())
    expect(fakeUserResult.is_ok())
    const fakeUser = fakeUserResult.unwrap()
    await userRepo.insert(fakeUser)
    const userResult = await userRepo.findById(fakeUser.id)

    expect(userResult.is_some()).toBeTruthy()

    user = userResult.unwrap()
    expect(user).toEqual(expect.objectContaining(fakeUser))

    // Add projects
    await Promise.all(
      [
        {
          nomProjet: 'userProject'
        },
        { nomProjet: 'nonUserProject' }
      ]
        .map(makeFakeProject)
        .map(makeProject)
        .filter(item => item.is_ok())
        .map(item => item.unwrap())
        .map(projectRepo.insert)
    )

    const foundUserProjects = await projectRepo.findAll({
      nomProjet: 'userProject'
    })

    expect(foundUserProjects).toHaveLength(1)
    userProject = foundUserProjects[0]

    // Add project to user
    await userRepo.addProject(fakeUser.id, userProject.id)
  })

  it('should return the projects owned by the user', async () => {
    const foundUserProjects = await listUserProjects({ userId: user.id })

    expect(foundUserProjects).toHaveLength(1)
    expect(foundUserProjects).toContainEqual(
      expect.objectContaining(userProject)
    )
  })
})
