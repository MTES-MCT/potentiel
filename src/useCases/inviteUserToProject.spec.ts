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
import makeInviteUserToProject, { ACCESS_DENIED_ERROR } from './inviteUserToProject'

describe('inviteUserToProject use-case', () => {
  const invitedEmail = 'invited@test.test'
  const user = UnwrapForTest(makeUser(makeFakeUser()))

  describe('given a single project', () => {
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
          expect(await userRepo.hasProject(invitedUser.id, projectId)).toEqual(true)
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

        expect(shouldUserAccessProject).toHaveBeenCalledWith({
          user,
          projectId,
        })
        expect(findProjectById).not.toHaveBeenCalled()
        expect(sendNotification).not.toHaveBeenCalled()
      })
    })
  })

  describe('given multiple projects', () => {
    const fakeProject1 = UnwrapForTest(makeProject(makeFakeProject()))
    const fakeProject2 = UnwrapForTest(makeProject(makeFakeProject()))
    const fakeProjectIds = [fakeProject1, fakeProject2].map((item) => item.id)

    describe('given the caller has rights to all projects', () => {
      const shouldUserAccessProject = jest.fn(async () => true)
      const findProjectById = jest.fn(async (projectId) => {
        if (projectId === fakeProject1.id) return fakeProject1
        if (projectId === fakeProject2.id) return fakeProject2
      })
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
            projectId: fakeProjectIds,
          })

          expect(res.is_ok()).toEqual(true)
        })

        it('should add all projects to the user account', async () => {
          expect(await userRepo.hasProject(invitedUser.id, fakeProject1.id)).toEqual(true)
          expect(await userRepo.hasProject(invitedUser.id, fakeProject2.id)).toEqual(true)
        })

        it('should send a single notification to the user', async () => {
          expect(sendNotification).toHaveBeenCalledTimes(1)
          expect(sendNotification).toHaveBeenCalledWith({
            type: 'project-invitation',
            message: {
              email: invitedEmail,
              subject: `${user.fullName} vous invite à suivre des projets sur Potentiel`,
            },
            variables: {
              nomProjet: fakeProject1.nomProjet + ', ' + fakeProject2.nomProjet,
              invitation_link: routes.USER_LIST_PROJECTS,
            },
            context: {
              projectId: fakeProject1.id + ',' + fakeProject2.id,
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
            projectId: fakeProjectIds,
          })

          expect(res.is_ok()).toEqual(true)
        })

        it('should send an invitation to the invited user', async () => {
          // TODO: should have one admission key per project

          // Verify project admission key
          const projectAdmissionKeys = await projectAdmissionKeyRepo.findAll()
          expect(projectAdmissionKeys).toHaveLength(2)
          const projectAdmissionKey1 = projectAdmissionKeys.find(
            (projectAdmissionKey) => projectAdmissionKey.projectId === fakeProject1.id
          )
          expect(projectAdmissionKey1).toBeDefined()
          if (!projectAdmissionKey1) return
          expect(projectAdmissionKey1.email).toEqual(invitedEmail)
          const projectAdmissionKey2 = projectAdmissionKeys.find(
            (projectAdmissionKey) => projectAdmissionKey.projectId === fakeProject2.id
          )
          expect(projectAdmissionKey2).toBeDefined()
          if (!projectAdmissionKey2) return
          expect(projectAdmissionKey2?.email).toEqual(invitedEmail)

          expect(sendNotification).toHaveBeenCalledTimes(1)
          expect(sendNotification).toHaveBeenCalledWith({
            type: 'project-invitation',
            message: {
              email: invitedEmail,
              subject: `${user.fullName} vous invite à suivre des projets sur Potentiel`,
            },
            variables: {
              nomProjet: fakeProject1.nomProjet + ', ' + fakeProject2.nomProjet,
              // This link is a link to the project itself
              invitation_link: routes.PROJECT_INVITATION({
                projectAdmissionKey: projectAdmissionKey1.id,
              }),
            },
            context: {
              projectId: fakeProject1.id + ',' + fakeProject2.id,
              projectAdmissionKeyId: projectAdmissionKey1.id,
            },
          })
        })
      })
    })

    describe('given the caller doesnt have rights to at least one of the projects', () => {
      it('should return ACCESS_DENIED_ERROR', async () => {
        const shouldUserAccessProject = jest.fn(async ({ projectId }) => {
          if (projectId === fakeProject1.id) return true
          return false
        })
        const findProjectById = jest.fn()
        const sendNotification = jest.fn()

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
          projectId: fakeProjectIds,
        })

        expect(res.is_err()).toEqual(true)
        expect(res.unwrap_err().message).toEqual(ACCESS_DENIED_ERROR)

        expect(shouldUserAccessProject).toHaveBeenCalledWith({
          user,
          projectId: fakeProject1.id,
        })
        expect(shouldUserAccessProject).toHaveBeenCalledWith({
          user,
          projectId: fakeProject2.id,
        })
        expect(findProjectById).not.toHaveBeenCalled()
        expect(sendNotification).not.toHaveBeenCalled()
      })
    })
  })
})
