import {
  credentialsRepo,
  projectAdmissionKeyRepo,
  resetDatabase,
  userRepo,
} from '../dataAccess/inMemory'
import { makeProject, makeUser, Credentials } from '../entities'
import routes from '../routes'
import { UnwrapForTest } from '../types'
import makeFakeProject from '../__tests__/fixtures/project'
import makeFakeUser from '../__tests__/fixtures/user'
import makeInviteUserToProject, {
  ACCESS_DENIED_ERROR,
} from './inviteUserToProject'

describe('inviteUserToProject use-case', () => {
  const invitedEmail = 'invited@test.test'
  const user = UnwrapForTest(makeUser(makeFakeUser()))

  describe('given the caller has rights to this project', () => {
    const fakeProject = UnwrapForTest(makeProject(makeFakeProject()))
    const projectId = fakeProject.id

    const shouldUserAccessProject = jest.fn(async () => true)
    const findProjectById = jest.fn(async () => fakeProject)
    const sendNotification = jest.fn()

    const inviteUserToProject = makeInviteUserToProject({
      findProjectById,
      userRepo,
      projectAdmissionKeyRepo,
      credentialsRepo,
      shouldUserAccessProject,
      sendNotification,
    })

    describe('given the invited user already has an account', () => {
      const invitedUser = UnwrapForTest(
        makeUser({
          email: invitedEmail,
          fullName: 'test',
          role: 'porteur-projet',
        })
      )

      beforeAll(async () => {
        resetDatabase()
        sendNotification.mockClear()

        await credentialsRepo.insert({
          userId: invitedUser.id,
          email: invitedEmail,
        } as Credentials)

        const res = await inviteUserToProject({
          email: invitedEmail,
          user,
          projectId,
        })

        expect(res.is_ok()).toEqual(true)
      })

      it('should add project to invited user', async () => {
        expect(await userRepo.hasProject(invitedUser.id, projectId)).toEqual(
          true
        )
      })
      it('should notify the user', () => {
        expect(sendNotification).toHaveBeenCalledTimes(1)
        expect(sendNotification).toHaveBeenCalledWith({
          type: 'project-invitation',
          message: {
            email: invitedEmail,
            subject: `${user.fullName} vous invite à suivre un projet sur Potentiel`,
          },
          variables: {
            nomProjet: fakeProject.nomProjet,
            invitation_link: routes.PROJECT_DETAILS(projectId),
          },
          context: {
            projectId,
            userId: user.id,
          },
        })
      })
    })

    describe('given the invited user doesnt have an account', () => {
      beforeAll(async () => {
        resetDatabase()
        sendNotification.mockClear()

        const res = await inviteUserToProject({
          email: invitedEmail,
          user,
          projectId,
        })

        expect(res.is_ok()).toEqual(true)
      })

      it('should send an invitation to the invited user', async () => {
        // Verify project admission key
        const projectAdmissionKeys = await projectAdmissionKeyRepo.findAll()
        expect(projectAdmissionKeys).toHaveLength(1)
        const projectAdmissionKey = projectAdmissionKeys[0]
        expect(projectAdmissionKey.email).toEqual(invitedEmail)
        expect(projectAdmissionKey.fullName).toEqual('')

        expect(sendNotification).toHaveBeenCalledTimes(1)
        expect(sendNotification).toHaveBeenCalledWith({
          type: 'project-invitation',
          message: {
            email: invitedEmail,
            subject: `${user.fullName} vous invite à suivre un projet sur Potentiel`,
          },
          variables: {
            nomProjet: fakeProject.nomProjet,
            // This link is a link to the project itself
            invitation_link: routes.PROJECT_INVITATION({
              projectAdmissionKey: projectAdmissionKey.id,
            }),
          },
          context: {
            projectId,
            projectAdmissionKeyId: projectAdmissionKey.id,
          },
        })
      })
    })
  })

  describe('given the caller doesnt have rights to this project', () => {
    it('should return ACCESS_DENIED_ERROR', async () => {
      const shouldUserAccessProject = jest.fn(async () => false)
      const findProjectById = jest.fn()
      const sendNotification = jest.fn()

      const projectId = 'project1'

      const inviteUserToProject = makeInviteUserToProject({
        findProjectById,
        userRepo,
        projectAdmissionKeyRepo,
        credentialsRepo,
        shouldUserAccessProject,
        sendNotification,
      })

      const res = await inviteUserToProject({
        email: invitedEmail,
        user,
        projectId,
      })

      expect(res.is_err()).toEqual(true)
      expect(res.unwrap_err().message).toEqual(ACCESS_DENIED_ERROR)

      expect(shouldUserAccessProject).toHaveBeenCalledWith({ user, projectId })
      expect(findProjectById).not.toHaveBeenCalled()
      expect(sendNotification).not.toHaveBeenCalled()
    })
  })
})
