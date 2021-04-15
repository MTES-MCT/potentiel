import { okAsync } from '../../../core/utils'
import { ProjectAdmissionKey, User } from '../../../entities'
import { NotificationArgs } from '../../../modules/notification'
import { fakeRepo } from '../../../__tests__/fixtures/aggregates'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { makeInviteUser } from './inviteUser'
import { UserWithEmailExistsAlreadyError } from '../errors'
import routes from '../../../routes'
import projectAdmissionKey from '../../../entities/projectAdmissionKey'

describe('inviteUser use-case', () => {
  describe('when inviting user is admin', () => {
    const adminUser: User = makeFakeUser({ role: 'admin' })

    describe('when invited email is not an existing user', () => {
      const sendNotification = jest.fn(async (args: NotificationArgs) => null)
      const getUserByEmail = jest.fn((email: string) =>
        okAsync<User | null, InfraNotAvailableError>(null)
      )
      const projectAdmissionKeyRepo = fakeRepo<ProjectAdmissionKey>()

      const inviteUser = makeInviteUser({
        projectAdmissionKeyRepo,
        getUserByEmail,
        sendNotification,
      })

      beforeAll(async () => {
        const res = await inviteUser({
          email: 'test@test.test',
          forRole: 'acheteur-obligé',
          invitedBy: adminUser,
        })
        expect(res.isOk()).toBe(true)
      })

      it('should create a new projectAdmissionKey with the given role', () => {
        expect(projectAdmissionKeyRepo.save).toHaveBeenCalledTimes(1)
        const invitation = projectAdmissionKeyRepo.save.mock.calls[0][0]

        expect(invitation.email).toEqual('test@test.test')
        expect(invitation.forRole).toEqual('acheteur-obligé')
      })

      it('should send an email to the email containing the projectAdmissionKey', () => {
        expect(sendNotification).toHaveBeenCalledTimes(1)

        const invitation = projectAdmissionKeyRepo.save.mock.calls[0][0]

        const sentEmail = sendNotification.mock.calls[0][0]
        expect(sentEmail.message.email).toEqual('test@test.test')
        expect(sentEmail.type).toEqual('user-invitation')
        expect(sentEmail.message.subject).toEqual(`Vous êtes invité à rejoindre Potentiel`)
        expect(sentEmail.variables).toHaveProperty('invitation_link')
        expect((sentEmail.variables as any).invitation_link).toContain(
          routes.USER_INVITATION({
            projectAdmissionKey: invitation.id,
          })
        )
      })
    })

    describe('when invited email is of anexisting user', () => {
      const fakeUser: User = makeFakeUser()

      const sendNotification = jest.fn(async (args: NotificationArgs) => null)
      const getUserByEmail = jest.fn((email: string) =>
        okAsync<User | null, InfraNotAvailableError>(fakeUser)
      )
      const projectAdmissionKeyRepo = fakeRepo<ProjectAdmissionKey>()

      const inviteUser = makeInviteUser({
        projectAdmissionKeyRepo,
        getUserByEmail,
        sendNotification,
      })

      it('should return a UserWithEmailExistsAlreadyError', async () => {
        const res = await inviteUser({
          email: 'test@test.test',
          forRole: 'acheteur-obligé',
          invitedBy: adminUser,
        })

        expect(res.isErr()).toBe(true)
        expect(res._unsafeUnwrapErr()).toBeInstanceOf(UserWithEmailExistsAlreadyError)
        expect(projectAdmissionKeyRepo.save).not.toHaveBeenCalled()
      })
    })
  })

  describe('when inviting user is not admin', () => {
    const notAdminUser: User = makeFakeUser({ role: 'porteur-projet' })

    const sendNotification = jest.fn(async (args: NotificationArgs) => null)
    const getUserByEmail = jest.fn((email: string) =>
      okAsync<User | null, InfraNotAvailableError>(null)
    )
    const projectAdmissionKeyRepo = fakeRepo<ProjectAdmissionKey>()

    const inviteUser = makeInviteUser({
      projectAdmissionKeyRepo,
      getUserByEmail,
      sendNotification,
    })

    it('should return a UnauthorizedError', async () => {
      const res = await inviteUser({
        email: 'test@test.test',
        forRole: 'acheteur-obligé',
        invitedBy: notAdminUser,
      })

      expect(res.isErr()).toBe(true)
      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)

      expect(projectAdmissionKeyRepo.save).not.toHaveBeenCalled()
    })
  })
})
