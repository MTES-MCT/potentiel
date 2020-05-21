import makeAddGarantiesFinancieres, {
  UNAUTHORIZED,
} from './addGarantiesFinancieres'
import makeShouldUserAccessProject from './shouldUserAccessProject'

import makeFakeProject from '../__tests__/fixtures/project'
import makeFakeUser from '../__tests__/fixtures/user'

import { makeProject, makeUser, User, Project } from '../entities'

import { projectRepo, userRepo, resetDatabase } from '../dataAccess/inMemory'

const shouldUserAccessProject = makeShouldUserAccessProject({ userRepo })
const addGarantiesFinancieres = makeAddGarantiesFinancieres({
  projectRepo,
  shouldUserAccessProject,
})

describe('addGarantiesFinancieres use-case', () => {
  let projet: Project
  let user: User

  beforeAll(async () => {
    resetDatabase()

    // Create a fake project
    const insertedProjects = (
      await Promise.all(
        [
          makeFakeProject({
            classe: 'Classé',
            notifiedOn: Date.now() - 40 * 24 * 3600 * 1000,
          }),
        ]
          .map(makeProject)
          .filter((item) => item.is_ok())
          .map((item) => item.unwrap())
          .map(projectRepo.insert)
      )
    )
      .filter((item) => item.is_ok())
      .map((item) => item.unwrap())

    expect(insertedProjects).toHaveLength(1)
    if (!insertedProjects[0]) return
    projet = insertedProjects[0]
    if (!projet) return

    // Create a fake user
    const insertedUsers = (
      await Promise.all(
        [makeFakeUser({ role: 'porteur-projet' })]
          .map(makeUser)
          .filter((item) => item.is_ok())
          .map((item) => item.unwrap())
          .map(userRepo.insert)
      )
    )
      .filter((item) => item.is_ok())
      .map((item) => item.unwrap())
    expect(insertedUsers).toHaveLength(1)
    if (!insertedUsers[0]) return
    user = insertedUsers[0]
    if (!user) return

    // Link project to user
    const res = await userRepo.addProject(user.id, projet.id)
    expect(res.is_ok()).toBeTruthy()
  })

  it('should update the project garantiesFinancieres* properties', async () => {
    const filename = 'fakeFile.pdf'
    const date = Date.now()

    const res = await addGarantiesFinancieres({
      filename,
      date,
      projectId: projet.id,
      user,
    })

    expect(res.is_ok()).toBe(true)
    if (res.is_err()) return

    // Get the latest version of the project
    const updatedProjectRes = await projectRepo.findById(projet.id)

    expect(updatedProjectRes.is_some()).toBe(true)
    if (updatedProjectRes.is_none()) return

    const updatedProject = updatedProjectRes.unwrap()

    expect(updatedProject.garantiesFinancieresSubmittedOn / 100).toBeCloseTo(
      Date.now() / 100,
      0
    )
    expect(updatedProject.garantiesFinancieresSubmittedBy).toEqual(user.id)
    expect(updatedProject.garantiesFinancieresFile).toEqual(filename)
    expect(updatedProject.garantiesFinancieresDate).toEqual(date)
  })

  it('should return an error if the user does not have the rights on this project', async () => {
    const filename = 'fakeFile.pdf'
    const date = Date.now()

    // Create another fake user
    const insertedUsers = (
      await Promise.all(
        [makeFakeUser({ role: 'porteur-projet' })]
          .map(makeUser)
          .filter((item) => item.is_ok())
          .map((item) => item.unwrap())
          .map(userRepo.insert)
      )
    )
      .filter((item) => item.is_ok())
      .map((item) => item.unwrap())
    expect(insertedUsers).toHaveLength(1)
    if (!insertedUsers[0]) return
    const otherUser = insertedUsers[0]
    if (!otherUser) return

    const res = await addGarantiesFinancieres({
      filename,
      date,
      projectId: projet.id,
      user: otherUser,
    })

    expect(res.is_err()).toBe(true)
    if (res.is_ok()) return

    expect(res.unwrap_err()).toEqual(new Error(UNAUTHORIZED))
  })
})
