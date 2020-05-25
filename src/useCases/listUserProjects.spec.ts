import makeListUserProjects from './listUserProjects'

import makeFakeUser from '../__tests__/fixtures/user'
import makeFakeProject from '../__tests__/fixtures/project'
import pagination from '../__tests__/fixtures/pagination'
import { makeUser, makeProject } from '../entities'
import { userRepo, projectRepo, resetDatabase } from '../dataAccess/inMemory'

const listUserProjects = makeListUserProjects({ projectRepo })

describe('listUserProjects use-case', () => {
  let user
  let userProject
  beforeAll(async () => {
    resetDatabase()
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
          nomProjet: 'userProject',
          notifiedOn: 1234,
        },
        {
          nomProjet: 'userProject',
          notifiedOn: 0,
        },
        { nomProjet: 'nonUserProject' },
      ]
        .map(makeFakeProject)
        .map(makeProject)
        .filter((item) => item.is_ok())
        .map((item) => item.unwrap())
        .map(projectRepo.save)
    )

    const foundUserProjects = await projectRepo.findAll(
      {
        nomProjet: 'userProject',
      },
      pagination
    )

    expect(foundUserProjects.items).toHaveLength(2)

    await Promise.all(
      foundUserProjects.items.map((project) =>
        userRepo.addProject(fakeUser.id, project.id)
      )
    )

    userProject = foundUserProjects.items.find((project) => project.notifiedOn)
    expect(userProject).toBeDefined()
  })

  it('should return the projects owned by the user that have been notified', async () => {
    const foundUserProjects = await listUserProjects({ userId: user.id })

    expect(foundUserProjects).toHaveLength(1)
    expect(foundUserProjects).toContainEqual(
      expect.objectContaining(userProject)
    )
  })
})
