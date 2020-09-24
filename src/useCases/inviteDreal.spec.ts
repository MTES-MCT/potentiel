import {
  credentialsRepo,
  projectAdmissionKeyRepo,
  resetDatabase,
  userRepo,
} from '../dataAccess/inMemory'
import { makeCredentials, makeUser, User } from '../entities'
import { NotificationArgs } from '../modules/notification'
import routes from '../routes'
import makeFakeUser from '../__tests__/fixtures/user'
import makeInviteDreal from './inviteDreal'

const sendNotification = jest.fn(async (args: NotificationArgs) => null)

const inviteDreal = makeInviteDreal({
  credentialsRepo,
  userRepo,
  projectAdmissionKeyRepo,
  sendNotification,
})

describe('inviteDreal use-case', () => {
  let user: User = makeFakeUser({ role: 'admin' })

  beforeEach(async () => {
    resetDatabase()
    sendNotification.mockClear()
  })

  it('should send an invitation link to the invited user if he has not account yet', async () => {
    const email = 'non-existing@user.test'

    const result = await inviteDreal({
      email,
      region: 'Corse',
      user,
    })

    expect(result.is_ok()).toBeTruthy()

    // Make sure a projectAdmissionKey has been created
    const projectAdmissionKeys = await projectAdmissionKeyRepo.findAll()
    expect(projectAdmissionKeys).toHaveLength(1)
    const projectAdmissionKey = projectAdmissionKeys[0]

    expect(projectAdmissionKey.email).toEqual(email)
    expect(projectAdmissionKey.dreal).toEqual('Corse')
    expect(projectAdmissionKey.lastUsedAt).toEqual(0)
    expect((projectAdmissionKey.createdAt || 0) / 1000).toBeCloseTo(
      Date.now() / 1000,
      0
    )

    // Make sure an invitation has been sent
    expect(sendNotification.mock.calls.map((item) => item[0])).toHaveLength(1)

    const sentEmail = sendNotification.mock.calls.map((item) => item[0])[0]
    expect(sentEmail.message.email).toEqual(email)
    expect(sentEmail.type).toEqual('dreal-invitation')
    expect(sentEmail.message.subject).toEqual(
      `${user.fullName} vous invite à suivre les projets de votre région sur Potentiel`
    )
    expect(sentEmail.variables).toHaveProperty('invitation_link')
    expect((sentEmail.variables as any).invitation_link).toContain(
      routes.DREAL_INVITATION({
        projectAdmissionKey: projectAdmissionKey.id,
      })
    )
  })

  it('should add rights to the dreal if user exists', async () => {
    // Reset email stub
    sendNotification.mockClear()

    const email = 'existing@user.test'

    const insertedUsers = (
      await Promise.all(
        [
          {
            email,
            fullName: 'test',
            role: 'dreal',
          },
        ]
          .map(makeUser)
          .filter((item) => item.is_ok())
          .map((item) => item.unwrap())
          .map(userRepo.insert)
      )
    )
      .filter((item) => item.is_ok())
      .map((item) => item.unwrap())

    expect(insertedUsers).toHaveLength(1)
    const existingUser = insertedUsers[0]
    if (!existingUser) return

    const insertedCredentials = (
      await Promise.all(
        [
          {
            email,
            userId: existingUser.id,
            password: 'password',
          },
        ]
          .map(makeCredentials)
          .filter((item) => item.is_ok())
          .map((item) => item.unwrap())
          .map(credentialsRepo.insert)
      )
    )
      .filter((item) => item.is_ok())
      .map((item) => item.unwrap())

    expect(insertedCredentials).toHaveLength(1)

    const result = await inviteDreal({
      email,
      region: 'Corse',
      user,
    })

    expect(result.is_ok()).toBeTruthy()

    // Make sure user is now attached to this dreal
    const drealsForUser = await userRepo.findDrealsForUser(existingUser.id)
    expect(drealsForUser).toHaveLength(1)
    expect(drealsForUser[0]).toEqual('Corse')

    // Make sure the notification has not been sent
    expect(sendNotification.mock.calls.map((item) => item[0])).toHaveLength(0)
  })
})
