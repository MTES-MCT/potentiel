import makeSignup, {
  PASSWORD_MISMATCH_ERROR,
  EMAIL_USED_ERROR,
  USER_INFO_ERROR,
  MISSING_ADMISSION_KEY_ERROR,
  INVALID_ADMISSION_KEY_ERROR,
} from './signup'

import makeLogin from './login'

import { UnwrapForTest } from '../types'
import {
  userRepo,
  credentialsRepo,
  projectAdmissionKeyRepo,
  resetDatabase,
} from '../dataAccess/inMemory'
import { makeCredentials, makeProjectAdmissionKey } from '../entities'
import { logger } from '../core/utils'

const login = makeLogin({
  userRepo,
  credentialsRepo,
})

const makePhonySignup = (overrides = {}) => ({
  password: 'password',
  confirmPassword: 'password',
  fullName: 'firstName lastName',
  email: 'email@email.com',
  projectAdmissionKey: 'projectAdmissionKey',
  ...overrides,
})

describe('signup use-case', () => {
  describe('given the user is a porteur-projet', () => {
    const addUserToProjectsWithEmail = jest.fn()
    const addUserToProject = jest.fn()

    const signup = makeSignup({
      userRepo,
      credentialsRepo,
      projectAdmissionKeyRepo,
      addUserToProjectsWithEmail,
      addUserToProject,
    })

    const invitationEmail = 'one@address.com'
    const invitationProject1 = 'project1'
    const invitationProject2 = 'project2'
    const projectAdmissionKeyId = 'projectAdmissionKey1'
    let phonySignup
    let newUserId

    beforeAll(async () => {
      await resetDatabase()

      // Add a projectAdmissionKey
      const [projectAdmissionKey] = (
        await Promise.all(
          [
            {
              id: projectAdmissionKeyId,
              email: invitationEmail,
              fullName: 'fullname',
              projectId: invitationProject1,
            },
            {
              id: 'other',
              email: invitationEmail,
              fullName: 'fullname',
              projectId: invitationProject2,
            },
          ]
            .map(makeProjectAdmissionKey)
            .filter((item) => item.is_ok())
            .map((item) => item.unwrap())
            .map((item) => projectAdmissionKeyRepo.save(item).then((res) => res.map(() => item)))
        )
      )
        .filter((item) => item.is_ok())
        .map((item) => item.unwrap())

      expect(projectAdmissionKey).toBeDefined()
      if (!projectAdmissionKey) return

      // Signup with the same email address
      phonySignup = makePhonySignup({
        projectAdmissionKey: projectAdmissionKey.id,
        email: 'other@email', // this will be ignored
      })

      const signupResult = await signup(phonySignup)

      expect(signupResult.is_ok()).toBeTruthy()

      newUserId = UnwrapForTest(signupResult).id
    })

    it('should create a new user with the email in the invitation', async () => {
      // Check if login works
      const userResult = await login({
        email: invitationEmail,
        password: phonySignup.password,
      })

      expect(userResult.is_ok()).toBeTruthy()
      if (!userResult.is_ok()) return

      const user = userResult.unwrap()
      expect(user).toEqual(
        expect.objectContaining({
          fullName: phonySignup.fullName,
        })
      )

      // Link the user account to the projectAdmissionKey that was used
      expect(user.projectAdmissionKey).toEqual(projectAdmissionKeyId)
    })

    it('should mark the project admission key as being used', async () => {
      // Make sure the projectAdmissionKey.lastUsedAt is updated
      const updatedProjectAdmissionKeyRes = await projectAdmissionKeyRepo.findById(
        projectAdmissionKeyId
      )
      expect(updatedProjectAdmissionKeyRes.is_some()).toEqual(true)
      const updatedProjectAdmissionKey = updatedProjectAdmissionKeyRes.unwrap()
      if (!updatedProjectAdmissionKey) return
      expect(updatedProjectAdmissionKey.lastUsedAt).toBeDefined()
      if (!updatedProjectAdmissionKey.lastUsedAt) return
      expect(updatedProjectAdmissionKey.lastUsedAt / 1000).toBeCloseTo(Date.now() / 1000, 0)
    })

    it('should link user to all projects with same email', () => {
      expect(addUserToProjectsWithEmail).toHaveBeenCalledWith(newUserId, invitationEmail)
    })

    it('should link user to all projects that have a project admission key with the same email', () => {
      expect(addUserToProject).toHaveBeenCalledTimes(2)
      expect(addUserToProject).toHaveBeenCalledWith(newUserId, invitationProject1)
      expect(addUserToProject).toHaveBeenCalledWith(newUserId, invitationProject2)
    })
  })

  describe('given the invitation specifies a role', () => {
    const addUserToProjectsWithEmail = jest.fn()
    const addUserToProject = jest.fn()

    const signup = makeSignup({
      userRepo,
      credentialsRepo,
      projectAdmissionKeyRepo,
      addUserToProjectsWithEmail,
      addUserToProject,
    })

    const invitationEmail = 'one@address.com'
    const invitationProject1 = 'project1'
    const invitationProject2 = 'project2'
    const projectAdmissionKeyId = 'projectAdmissionKey1'
    let phonySignup
    let newUserId

    beforeAll(async () => {
      await resetDatabase()

      // Add a projectAdmissionKey
      const [projectAdmissionKey] = (
        await Promise.all(
          [
            {
              id: projectAdmissionKeyId,
              email: invitationEmail,
              fullName: 'fullname',
              forRole: 'acheteur-obligé',
            },
          ]
            .map(makeProjectAdmissionKey)
            .filter((item) => item.is_ok())
            .map((item) => item.unwrap())
            .map((item) => projectAdmissionKeyRepo.save(item).then((res) => res.map(() => item)))
        )
      )
        .filter((item) => item.is_ok())
        .map((item) => item.unwrap())

      expect(projectAdmissionKey).toBeDefined()
      if (!projectAdmissionKey) return

      // Signup with the same email address
      phonySignup = makePhonySignup({
        projectAdmissionKey: projectAdmissionKey.id,
        email: invitationEmail,
      })

      const signupResult = await signup(phonySignup)

      expect(signupResult.is_ok()).toBeTruthy()

      newUserId = UnwrapForTest(signupResult).id
    })

    it('should create a new user with the role in the invitation', async () => {
      // Check if login works
      const userResult = await login({
        email: invitationEmail,
        password: phonySignup.password,
      })

      expect(userResult.is_ok()).toBeTruthy()
      if (!userResult.is_ok()) return

      const user = userResult.unwrap()
      expect(user).toMatchObject({
        fullName: phonySignup.fullName,
        role: 'acheteur-obligé',
      })

      // Link the user account to the projectAdmissionKey that was used
      expect(user.projectAdmissionKey).toEqual(projectAdmissionKeyId)
    })
  })

  describe('given the user is a dreal', () => {
    const addUserToProjectsWithEmail = jest.fn()
    const addUserToProject = jest.fn()

    const signup = makeSignup({
      userRepo,
      credentialsRepo,
      projectAdmissionKeyRepo,
      addUserToProjectsWithEmail,
      addUserToProject,
    })

    const invitationEmail = 'one@address.com'
    const overrideEmail = 'Other@Address.com'
    const projectAdmissionKeyId = 'projectAdmissionKey1'
    let phonySignup
    let newUserId

    beforeAll(async () => {
      await resetDatabase()

      // Add a projectAdmissionKey
      const [projectAdmissionKey] = (
        await Promise.all(
          [
            {
              id: projectAdmissionKeyId,
              email: invitationEmail,
              fullName: 'fullname',
              dreal: 'Corse',
            },
          ]
            .map(makeProjectAdmissionKey)
            .filter((item) => item.is_ok())
            .map((item) => item.unwrap())
            .map((item) => projectAdmissionKeyRepo.save(item).then((res) => res.map(() => item)))
        )
      )
        .filter((item) => item.is_ok())
        .map((item) => item.unwrap())

      expect(projectAdmissionKey).toBeDefined()
      if (!projectAdmissionKey) return

      // Signup with the same email address
      phonySignup = makePhonySignup({
        projectAdmissionKey: projectAdmissionKey.id,
        email: overrideEmail,
      })

      const signupResult = await signup(phonySignup)

      expect(signupResult.is_ok()).toBeTruthy()

      newUserId = UnwrapForTest(signupResult).id

      expect(addUserToProjectsWithEmail).not.toHaveBeenCalled()
      expect(addUserToProject).not.toHaveBeenCalled()
    })

    it('should create a new user with the email provided by the other', async () => {
      const createdUsers = await userRepo.findAll({ id: newUserId })

      expect(createdUsers).toHaveLength(1)

      const createdUser = createdUsers[0]

      expect(createdUser.email).toEqual(overrideEmail.toLowerCase())
      expect(createdUser.projectAdmissionKey).toEqual(projectAdmissionKeyId)
      expect(createdUser.fullName).toEqual(phonySignup.fullName)

      // Check if login works
      const userResult = await login({
        email: overrideEmail.toLowerCase(),
        password: phonySignup.password,
      })

      if (userResult.is_err()) logger.error(userResult.unwrap_err())
      expect(userResult.is_ok()).toBeTruthy()
    })

    it('should add the user to the dreal', async () => {
      const userDreals = await userRepo.findDrealsForUser(newUserId)
      expect(userDreals).toHaveLength(1)
      expect(userDreals[0]).toEqual('Corse')
    })
  })

  describe('given the passwords dont match', () => {
    const signup = makeSignup({
      userRepo,
      credentialsRepo,
      projectAdmissionKeyRepo,
      addUserToProjectsWithEmail: jest.fn(() => {
        throw new Error('should not be used')
      }),
      addUserToProject: jest.fn(() => {
        throw new Error('should not be used')
      }),
    })

    it('should return PASSWORD_MISMATCH_ERROR', async () => {
      const phonySignup = makePhonySignup({
        password: 'a',
        confirmPassword: 'b',
      })
      const signupResult = await signup(phonySignup)

      expect(signupResult.is_err()).toBe(true)
      if (!signupResult.is_err()) return

      expect(signupResult.unwrap_err()).toEqual(new Error(PASSWORD_MISMATCH_ERROR))
    })
  })

  describe('given fullname is missing', () => {
    const signup = makeSignup({
      userRepo,
      credentialsRepo,
      projectAdmissionKeyRepo,
      addUserToProjectsWithEmail: jest.fn(() => {
        throw new Error('should not be used')
      }),
      addUserToProject: jest.fn(() => {
        throw new Error('should not be used')
      }),
    })

    it('should return USER_INFO_ERROR', async () => {
      // Add a projectAdmissionKey
      const [projectAdmissionKey] = (
        await Promise.all(
          [
            {
              id: 'projectAdmissionKey',
              email: 'bla@bli.com',
              fullName: 'fullname',
            },
          ]
            .map(makeProjectAdmissionKey)
            .filter((item) => item.is_ok())
            .map((item) => item.unwrap())
            .map((item) => projectAdmissionKeyRepo.save(item).then((res) => res.map(() => item)))
        )
      )
        .filter((item) => item.is_ok())
        .map((item) => item.unwrap())

      expect(projectAdmissionKey).toBeDefined()
      if (!projectAdmissionKey) return

      const phonySignup = makePhonySignup({
        fullName: null,
        projectAdmissionKey: projectAdmissionKey.id,
      })
      const signupResult = await signup(phonySignup)

      expect(signupResult.is_err()).toBe(true)
      if (!signupResult.is_err()) return

      expect(signupResult.unwrap_err()).toEqual(new Error(USER_INFO_ERROR))
    })
  })

  describe('given projectAdmissionKey is missing', () => {
    const signup = makeSignup({
      userRepo,
      credentialsRepo,
      projectAdmissionKeyRepo,
      addUserToProjectsWithEmail: jest.fn(() => {
        throw new Error('should not be used')
      }),
      addUserToProject: jest.fn(() => {
        throw new Error('should not be used')
      }),
    })

    it('should return MISSING_ADMISSION_KEY_ERROR', async () => {
      const phonySignup = makePhonySignup({ projectAdmissionKey: null })
      const signupResult = await signup(phonySignup)

      expect(signupResult.is_err()).toEqual(true)
      if (!signupResult.is_err()) return

      expect(signupResult.unwrap_err()).toEqual(new Error(MISSING_ADMISSION_KEY_ERROR))
    })
  })

  describe('given email is already used', () => {
    const signup = makeSignup({
      userRepo,
      credentialsRepo,
      projectAdmissionKeyRepo,
      addUserToProjectsWithEmail: jest.fn(() => {
        throw new Error('should not be used')
      }),
      addUserToProject: jest.fn(() => {
        throw new Error('should not be used')
      }),
    })

    beforeAll(async () => {
      await resetDatabase()

      await credentialsRepo.insert(
        UnwrapForTest(
          makeCredentials({ email: 'existing@email.com', password: 'password', userId: '' })
        )
      )
    })

    it('should return EMAIL_USED_ERROR', async () => {
      // Add a projectAdmissionKey
      const [projectAdmissionKey] = (
        await Promise.all(
          [
            {
              id: 'projectAdmissionKey',
              email: 'existing@email.com',
              fullName: 'fullname',
            },
          ]
            .map(makeProjectAdmissionKey)
            .filter((item) => item.is_ok())
            .map((item) => item.unwrap())
            .map((item) => projectAdmissionKeyRepo.save(item).then((res) => res.map(() => item)))
        )
      )
        .filter((item) => item.is_ok())
        .map((item) => item.unwrap())

      expect(projectAdmissionKey).toBeDefined()
      if (!projectAdmissionKey) return

      const phonySignup = makePhonySignup({
        email: 'Existing@email.com',
        projectAdmissionKey: projectAdmissionKey.id,
      })

      const signupResult = await signup(phonySignup)

      expect(signupResult.is_err()).toEqual(true)
      if (!signupResult.is_err()) return

      expect(signupResult.unwrap_err()).toEqual(new Error(EMAIL_USED_ERROR))
    })
  })

  describe('given admission key is already used', () => {
    const signup = makeSignup({
      userRepo,
      credentialsRepo,
      projectAdmissionKeyRepo,
      addUserToProjectsWithEmail: jest.fn(() => {
        throw new Error('should not be used')
      }),
      addUserToProject: jest.fn(() => {
        throw new Error('should not be used')
      }),
    })

    beforeAll(async () => {
      await resetDatabase()
    })

    it('should return INVALID_ADMISSION_KEY_ERROR', async () => {
      // Add a projectAdmissionKey
      const [projectAdmissionKey] = (
        await Promise.all(
          [
            {
              id: 'projectAdmissionKey',
              email: 'existing@email.com',
              fullName: 'fullname',
              lastUsedAt: 1,
            },
          ]
            .map(makeProjectAdmissionKey)
            .filter((item) => item.is_ok())
            .map((item) => item.unwrap())
            .map((item) => projectAdmissionKeyRepo.save(item).then((res) => res.map(() => item)))
        )
      )
        .filter((item) => item.is_ok())
        .map((item) => item.unwrap())

      expect(projectAdmissionKey).toBeDefined()
      if (!projectAdmissionKey) return

      const phonySignup = makePhonySignup({
        email: 'Existing@email.com',
        projectAdmissionKey: projectAdmissionKey.id,
      })

      const signupResult = await signup(phonySignup)

      expect(signupResult.is_err()).toEqual(true)
      if (!signupResult.is_err()) return

      expect(signupResult.unwrap_err()).toEqual(new Error(INVALID_ADMISSION_KEY_ERROR))
    })
  })

  describe('given admission key has been cancelled', () => {
    const signup = makeSignup({
      userRepo,
      credentialsRepo,
      projectAdmissionKeyRepo,
      addUserToProjectsWithEmail: jest.fn(() => {
        throw new Error('should not be used')
      }),
      addUserToProject: jest.fn(() => {
        throw new Error('should not be used')
      }),
    })

    beforeAll(async () => {
      await resetDatabase()
    })

    it('should return INVALID_ADMISSION_KEY_ERROR', async () => {
      // Add a projectAdmissionKey
      const [projectAdmissionKey] = (
        await Promise.all(
          [
            {
              id: 'projectAdmissionKey',
              email: 'existing@email.com',
              fullName: 'fullname',
              cancelled: true,
            },
          ]
            .map(makeProjectAdmissionKey)
            .filter((item) => item.is_ok())
            .map((item) => item.unwrap())
            .map((item) => projectAdmissionKeyRepo.save(item).then((res) => res.map(() => item)))
        )
      )
        .filter((item) => item.is_ok())
        .map((item) => item.unwrap())

      expect(projectAdmissionKey).toBeDefined()
      if (!projectAdmissionKey) return

      const phonySignup = makePhonySignup({
        email: 'Existing@email.com',
        projectAdmissionKey: projectAdmissionKey.id,
      })

      const signupResult = await signup(phonySignup)

      expect(signupResult.is_err()).toEqual(true)
      if (!signupResult.is_err()) return

      expect(signupResult.unwrap_err()).toEqual(new Error(INVALID_ADMISSION_KEY_ERROR))
    })
  })
})
