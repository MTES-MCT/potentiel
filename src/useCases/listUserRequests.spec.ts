import makeListUserRequests from './listUserRequests'
import makeRequestModification from './requestModification'

import makeFakeUser from '../__tests__/fixtures/user'
import makeFakeRequest from '../__tests__/fixtures/modificationRequest'
import makeFakeProject from '../__tests__/fixtures/project'
import { makeUser, makeModificationRequest, makeProject } from '../entities'
import {
  modificationRequestRepo,
  userRepo,
  projectRepo,
} from '../dataAccess/inMemory'

const listUserRequests = makeListUserRequests({ modificationRequestRepo })
const requestModification = makeRequestModification({ modificationRequestRepo })

describe('listUserRequests use-case', () => {
  let user
  let userProject
  let userRequest
  let foundUserRequests
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

    // Create a project
    const fakeProjectResult = makeProject(makeFakeProject())
    expect(fakeProjectResult.is_ok())
    const fakeProject = fakeProjectResult.unwrap()
    await projectRepo.save(fakeProject)
    const projectResult = await projectRepo.findById(fakeProject.id)

    expect(projectResult.is_some()).toBeTruthy()

    userProject = projectResult.unwrap()
    expect(userProject).toEqual(expect.objectContaining(fakeProject))

    // Add a modification request through the requestModification use-case
    userRequest = {
      type: 'actionnaire',
      actionnaire: 'nouvel actionnaire',
      filename: 'fichier',
      userId: user.id,
      projectId: userProject.id,
    }
    const insertionResult = await requestModification(userRequest)

    expect(insertionResult.is_ok()).toBeTruthy()

    // Add another modification request for a phony user
    await modificationRequestRepo.insert(makeFakeRequest())

    const allModificationRequests = await modificationRequestRepo.findAll()
    expect(allModificationRequests).toHaveLength(2)

    foundUserRequests = await listUserRequests({ userId: user.id })
  })

  it('should return the requests made by the user', async () => {
    expect(foundUserRequests).toHaveLength(1)
    expect(foundUserRequests[0]).toEqual(expect.objectContaining(userRequest))
  })

  it.todo(
    'should include the events that happened on this request'
    // async () => {
    //   // TODO: add events to the modificationRequest in the beforeAll statement (call the update modificationRequest use-case once it exists)
    //   expect(foundUserRequests[0].events).toBeDefined()
    // }
  )
})
