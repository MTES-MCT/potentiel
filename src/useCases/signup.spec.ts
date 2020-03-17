import makeSignup, {
  PASSWORD_MISMATCH_ERROR,
  EMAIL_USED_ERROR,
  USER_INFO_ERROR,
  MISSING_PROJECT_ID_ERROR,
  WRONG_PROJECT_ADMISSION_KEY_ERROR
} from './signup'

import makeLogin from './login'

import {
  userRepo,
  credentialsRepo,
  projectAdmissionKeyRepo,
  projectRepo,
  resetDatabase
} from '../dataAccess/inMemory'
import { makeCredentials, makeProjectAdmissionKey } from '../entities'
import makeFakeProject from '../__tests__/fixtures/project'

const signup = makeSignup({
  userRepo,
  credentialsRepo,
  projectAdmissionKeyRepo
})

const login = makeLogin({
  userRepo,
  credentialsRepo
})

const makePhonySignup = (overrides = {}) => ({
  password: 'password',
  confirmPassword: 'password',
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email@email.com',
  ...overrides
})

describe('signup use-case', () => {
  beforeEach(async () => {
    resetDatabase()
    await credentialsRepo.insert(
      makeCredentials({
        email: 'existing@email.com',
        userId: '1',
        hash: 'qsdsqdqsdqs'
      })
    )
  })

  it('should create a new user with the project attached', async () => {
    // Create a fake project
    await projectRepo.insertMany([
      makeFakeProject({ id: '1' }),
      makeFakeProject({ id: '2' })
    ])
    const [project, otherProject] = await projectRepo.findAll()

    expect(project).toBeDefined()

    // Add a projectAdmissionKey
    const projectAdmissionKey = makeProjectAdmissionKey({
      id: 'projectAdmissionKey',
      projectId: project.id
    })
    await projectAdmissionKeyRepo.insertMany([projectAdmissionKey])
    await projectRepo.addProjectAdmissionKey(project.id, projectAdmissionKey.id)

    const phonySignup = makePhonySignup({
      projectAdmissionKey: projectAdmissionKey.id,
      projectId: project.id
    })

    await signup(phonySignup)

    // Check if login works
    const user = await login({
      email: phonySignup.email,
      password: phonySignup.password
    })

    expect(user).toBeDefined()
    expect(user).toEqual(
      expect.objectContaining({
        firstName: phonySignup.firstName,
        lastName: phonySignup.lastName
      })
    )

    if (!user) return

    // Check if the project has been attached
    const userProjects = await userRepo.findProjects(user.id)
    expect(userProjects).toHaveLength(1)
    expect(userProjects).toContainEqual(expect.objectContaining(project))
  })

  it("should return an error if passwords don't match", async () => {
    expect.assertions(1)
    try {
      await signup(makePhonySignup({ password: 'a', confirmPassword: 'b' }))
    } catch (e) {
      expect(e).toEqual(new Error(PASSWORD_MISMATCH_ERROR))
    }
  })

  it('should return an error if firstName or lastName are missing', async () => {
    expect.assertions(1)
    try {
      await signup(makePhonySignup({ firstName: null }))
    } catch (e) {
      expect(e).toEqual(new Error(USER_INFO_ERROR))
    }
  })

  it('should return an error if email is already used', async () => {
    expect.assertions(1)
    try {
      await signup(makePhonySignup({ email: 'existing@email.com' }))
    } catch (e) {
      expect(e).toEqual(new Error(EMAIL_USED_ERROR))
    }
  })

  it('should return an error if projectAdmissionKey is present but no projectId', async () => {
    expect.assertions(1)
    try {
      await signup(
        makePhonySignup({ projectAdmissionKey: 'projectAdmissionKey' })
      )
    } catch (e) {
      expect(e).toEqual(new Error(MISSING_PROJECT_ID_ERROR))
    }
  })

  it("should return an error if projectAdmissionKey doesn't exist", async () => {
    expect.assertions(1)
    try {
      await signup(
        makePhonySignup({
          projectAdmissionKey: 'projectAdmissionKey',
          projectId: '1'
        })
      )
    } catch (e) {
      expect(e).toEqual(new Error(WRONG_PROJECT_ADMISSION_KEY_ERROR))
    }
  })

  it("should return an error if projectAdmissionKey doesn't match projectId", async () => {
    expect.assertions(2)

    // Create a fake project
    await projectRepo.insertMany([makeFakeProject()])
    const [project] = await projectRepo.findAll()

    expect(project).toBeDefined()

    // Add a projectAdmissionKey
    const projectAdmissionKey = 'projectAdmissionKey'
    await projectRepo.addProjectAdmissionKey(project.id, projectAdmissionKey)

    try {
      await signup(
        makePhonySignup({
          projectAdmissionKey: projectAdmissionKey,
          projectId: 'notTheCorrectId'
        })
      )
    } catch (e) {
      expect(e).toEqual(new Error(WRONG_PROJECT_ADMISSION_KEY_ERROR))
    }
  })
})
