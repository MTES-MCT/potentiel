import { okAsync } from 'neverthrow'
import { ProjectAdmissionKey } from '../../../entities'
import { Ok } from '../../../types'
import { GetPeriodeTitle } from '../../appelOffre'
import { StoredEvent } from '../../eventStore'
import { NotificationArgs } from '../../notification'
import { InfraNotAvailableError } from '../../shared'
import {
  CandidateNotificationForPeriodeFailed,
  CandidateNotifiedForPeriode,
} from '../events'
import { handleCandidateNotifiedForPeriode } from './handleCandidateNotifiedForPeriode'

const eventBus = {
  publish: jest.fn((event: StoredEvent) =>
    okAsync<null, InfraNotAvailableError>(null)
  ),
  subscribe: jest.fn(),
}

const fakePayload = {
  periodeId: 'periode1',
  appelOffreId: 'appelOffre1',
  candidateEmail: 'email1@test.test',
  candidateName: 'name',
}

describe('handleCandidateNotifiedForPeriode', () => {
  describe('general case', () => {
    const sendNotification = jest.fn(async (args: NotificationArgs) => null)
    const saveProjectAdmissionKey = jest.fn(async (args: ProjectAdmissionKey) =>
      Ok(null)
    )
    const getPeriodeTitle = (jest.fn((appelOffreId, periodeId) =>
      okAsync({
        periodeTitle: 'periode1title',
        appelOffreTitle: 'appelOffre1title',
      })
    ) as unknown) as GetPeriodeTitle

    beforeAll(async () => {
      eventBus.publish.mockClear()

      await handleCandidateNotifiedForPeriode({
        eventBus,
        sendNotification,
        saveProjectAdmissionKey,
        getPeriodeTitle,
      })(
        new CandidateNotifiedForPeriode({
          payload: { ...fakePayload },
          requestId: 'request1',
        })
      )
    })

    it('should call sendNotification', () => {
      expect(sendNotification).toHaveBeenCalledTimes(1)
      const notificationArgs = sendNotification.mock.calls[0][0]

      expect(notificationArgs.message.email).toEqual(fakePayload.candidateEmail)
      expect(notificationArgs.message.name).toEqual(fakePayload.candidateName)
      expect(notificationArgs.message.subject).toContain('periode1title')
      expect(notificationArgs.message.subject).toContain('appelOffre1title')
      expect(notificationArgs.type).toEqual('designation')
    })

    it('should not trigger CandidateNotificationForPeriodeFailed', () => {
      expect(eventBus.publish).not.toHaveBeenCalled()
    })
  })

  describe('when sendNotification fails', () => {
    const sendNotification = jest.fn(async (args: NotificationArgs) => {
      throw new Error('oops')
    })
    const saveProjectAdmissionKey = jest.fn(async (args: ProjectAdmissionKey) =>
      Ok(null)
    )
    const getPeriodeTitle = (jest.fn((appelOffreId, periodeId) =>
      okAsync({
        periodeTitle: 'periode1title',
        appelOffreTitle: 'appelOffre1title',
      })
    ) as unknown) as GetPeriodeTitle

    beforeAll(async () => {
      eventBus.publish.mockClear()

      await handleCandidateNotifiedForPeriode({
        eventBus,
        sendNotification,
        saveProjectAdmissionKey,
        getPeriodeTitle,
      })(
        new CandidateNotifiedForPeriode({
          payload: { ...fakePayload },
          requestId: 'request1',
        })
      )
    })

    it('should trigger CandidateNotificationForPeriodeFailed', () => {
      const event = eventBus.publish.mock.calls
        .map((call) => call[0])
        .filter(
          (event): event is CandidateNotificationForPeriodeFailed =>
            event.type === CandidateNotificationForPeriodeFailed.type
        )
        .pop()

      expect(event).toBeDefined()

      expect(event!.requestId).toEqual('request1')
      expect(event!.payload.error).toEqual('oops')
      expect(event!.payload.candidateEmail).toEqual(fakePayload.candidateEmail)
      expect(event!.payload.periodeId).toEqual(fakePayload.periodeId)
      expect(event!.payload.appelOffreId).toEqual(fakePayload.appelOffreId)
    })
  })
})
