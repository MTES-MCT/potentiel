import { okAsync } from 'neverthrow'
import { makeProject, makeUser, Project } from '../../../entities'
import { UnwrapForTest } from '../../../types'
import makeFakeProject from '../../../__tests__/fixtures/project'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { StoredEvent } from '../../eventStore'
import { NotificationArgs } from '../../notification'
import { ProjectCertificateUpdated } from '../../project/events'
import { InfraNotAvailableError } from '../../shared'
import {
  CandidateInformationOfCertificateUpdateFailed,
  CandidateInformedOfCertificateUpdate,
} from '../events'

import { handleProjectCertificateUpdated } from './handleProjectCertificateUpdated'

const eventBus = {
  publish: jest.fn((event: StoredEvent) => okAsync<null, InfraNotAvailableError>(null)),
  subscribe: jest.fn(),
}

describe('candidateNotificatio.handleProjectCertificateUpdated', () => {
  const projectUsers = ['email1@test.test', 'email1@test.test'].map((email) =>
    UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet', email })))
  )

  const project = UnwrapForTest(makeProject(makeFakeProject({ id: 'project1' })))

  const getUsersForProject = jest.fn(async (projectId: Project['id']) => projectUsers)
  const findProjectById = jest.fn(async (projectId) => project)

  describe('when sendNotification succeeds', () => {
    const sendNotification = jest.fn(async (args: NotificationArgs) => null)

    beforeAll(async () => {
      eventBus.publish.mockClear()

      await handleProjectCertificateUpdated({
        eventBus,
        sendNotification,
        getUsersForProject,
        findProjectById,
      })(
        new ProjectCertificateUpdated({
          payload: { projectId: 'project1', certificateFileId: 'file1' },
          requestId: 'request1',
        })
      )
    })

    it('should call sendNotification for each user that has rights to this project', () => {
      expect(sendNotification).toHaveBeenCalledTimes(projectUsers.length)
      const notifications = sendNotification.mock.calls.map((call) => call[0])

      expect(notifications.map((notification) => notification.message.email)).toEqual(
        projectUsers.map((user) => user.email)
      )

      expect(
        notifications.every((notification) => notification.type === 'pp-certificate-updated')
      ).toBe(true)

      expect(
        notifications.every(
          (notification) => (notification.context as any).projectId === project.id
        )
      ).toBe(true)

      expect(
        notifications.every(
          (notification) => (notification.variables as any).nomProjet === project.nomProjet
        )
      ).toBe(true)
    })

    it('should trigger a CandidateInformedOfCertificateUpdate for each user', () => {
      expect(eventBus.publish).toHaveBeenCalledTimes(projectUsers.length)
      const events = eventBus.publish.mock.calls.map((call) => call[0])

      expect(
        events.every((event) => event.type === CandidateInformedOfCertificateUpdate.type)
      ).toBe(true)

      expect(events.map((event) => (event.payload as any).porteurProjetId)).toEqual(
        projectUsers.map((user) => user.id)
      )

      expect(events.every((event) => (event.payload as any).projectId === project.id)).toBe(true)
    })
  })

  describe('when sendNotification fails', () => {
    const sendNotification = jest.fn(async (args: NotificationArgs) => {
      throw new Error('oops')
    })

    beforeAll(async () => {
      eventBus.publish.mockClear()

      await handleProjectCertificateUpdated({
        eventBus,
        sendNotification,
        getUsersForProject,
        findProjectById,
      })(
        new ProjectCertificateUpdated({
          payload: { projectId: 'project1', certificateFileId: 'file1' },
          requestId: 'request1',
        })
      )
    })

    it('should trigger CandidateNotificationForPeriodeFailed for each failed notification', () => {
      expect(eventBus.publish).toHaveBeenCalledTimes(projectUsers.length)
      const events = eventBus.publish.mock.calls.map((call) => call[0])

      expect(
        events.every((event) => event.type === CandidateInformationOfCertificateUpdateFailed.type)
      ).toBe(true)

      expect(events.map((event) => (event.payload as any).porteurProjetId)).toEqual(
        projectUsers.map((user) => user.id)
      )

      expect(events.every((event) => (event.payload as any).projectId === project.id)).toBe(true)

      expect(events.every((event) => (event.payload as any).error === 'oops')).toBe(true)
    })
  })
})
