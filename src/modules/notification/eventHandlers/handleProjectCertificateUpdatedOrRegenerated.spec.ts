import { UniqueEntityID } from '@core/domain'
import { makeUser } from '../../../entities'
import { UnwrapForTest } from '../../../types'
import { fakeRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { NotificationArgs } from '..'
import { ProjectCertificateUpdated } from '../../project/events'
import { Project } from '../../project/Project'
import { handleProjectCertificateUpdatedOrRegenerated } from './handleProjectCertificateUpdatedOrRegenerated'

describe('candidateNotificatio.handleProjectCertificateUpdatedOrRegenerated', () => {
  const projectUsers = ['email1@test.test', 'email1@test.test'].map((email) =>
    UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet', email })))
  )

  const projectId = 'project1'

  const fakeProject = { ...makeFakeProject(), id: new UniqueEntityID(projectId) }

  const projectRepo = fakeRepo(fakeProject as Project)

  const getUsersForProject = jest.fn(async (projectId: string) => projectUsers)

  const sendNotification = jest.fn(async (args: NotificationArgs) => null)

  it('should call sendNotification for each user that has rights to this project', async () => {
    await handleProjectCertificateUpdatedOrRegenerated({
      sendNotification,
      getUsersForProject,
      projectRepo,
    })(
      new ProjectCertificateUpdated({
        payload: { projectId, certificateFileId: 'file1', uploadedBy: 'user1' },
        requestId: 'request1',
      })
    )

    expect(getUsersForProject).toHaveBeenCalledWith(projectId)

    expect(sendNotification).toHaveBeenCalledTimes(projectUsers.length)
    const notifications = sendNotification.mock.calls.map((call) => call[0])

    expect(notifications.map((notification) => notification.message.email)).toEqual(
      projectUsers.map((user) => user.email)
    )

    expect(
      notifications.every((notification) => notification.type === 'pp-certificate-updated')
    ).toBe(true)

    expect(
      notifications.every((notification) => (notification.context as any).projectId === projectId)
    ).toBe(true)
  })
})
