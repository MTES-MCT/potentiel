import makeListUserProjects from './listUserProjects'

import makeFakeUser from '../__tests__/fixtures/user'
import makeFakeProject from '../__tests__/fixtures/project'

import { userRepo } from '../dataAccess/inMemory'
import { projectRepo } from '../dataAccess/inMemory'

const listUserProjects = makeListUserProjects({ userRepo })

describe('listUserProjects use-case', () => {
  let user
  let userProject
  beforeAll(async () => {
    // Create a user
    const fakeUser = makeFakeUser()
    const userId = await userRepo.insert(fakeUser)
    user = await userRepo.findById(userId)

    expect(user).toEqual(expect.objectContaining(fakeUser))

    // Add projects
    await projectRepo.insertMany(
      [
        {
          nomProjet: 'userProject'
        },
        { nomProjet: 'nonUserProject' }
      ].map(makeFakeProject)
    )

    const foundUserProjects = await projectRepo.findAll({
      nomProjet: 'userProject'
    })

    expect(foundUserProjects).toHaveLength(1)
    userProject = foundUserProjects[0]

    // Add project to user
    await userRepo.addProject(userId, userProject.id)
  })

  it('should return the projects owned by the user', async () => {
    const foundUserProjects = await listUserProjects({ userId: user.id })

    expect(foundUserProjects).toHaveLength(1)
    expect(foundUserProjects).toContainEqual(
      expect.objectContaining(userProject)
    )
  })
})
