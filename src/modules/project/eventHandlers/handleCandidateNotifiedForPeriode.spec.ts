import { okAsync } from 'neverthrow'
import { ProjectAdmissionKey } from '../../../entities'
import { InMemoryEventStore } from '../../../infra/inMemory'
import { Ok } from '../../../types'
import { GetPeriodeTitle } from '../../appelOffre'
import { NotificationArgs } from '../../notification'
import {
  CandidateNotificationForPeriodeFailed,
  CandidateNotifiedForPeriode,
} from '../events'
import { handleCandidateNotifiedForPeriode } from './'

describe('handleCandidateNotifiedForPeriode', () => {
  describe('general case', () => {
    const eventStore = new InMemoryEventStore()

    const fakePayload = {
      periodeId: 'periode1',
      appelOffreId: 'appelOffre1',
      candidateEmail: 'email1@test.test',
      candidateName: 'name',
    }

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

    const fakeCandidateNotificationForPeriodeFailedHandler = jest.fn()

    beforeAll(async () => {
      eventStore.subscribe(
        CandidateNotificationForPeriodeFailed.type,
        fakeCandidateNotificationForPeriodeFailedHandler
      )

      handleCandidateNotifiedForPeriode(eventStore, {
        sendNotification,
        saveProjectAdmissionKey,
        getPeriodeTitle,
      })

      await eventStore.publish(
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
      expect(
        fakeCandidateNotificationForPeriodeFailedHandler
      ).not.toHaveBeenCalled()
    })
  })

  // describe('when sendNotification fails', () => {
  //   const eventStore = new InMemoryEventStore()

  //   const fakePayload = {
  //     periodeId: 'periode1',
  //     appelOffreId: 'appelOffre1',
  //     candidateEmail: 'email1@test.test',
  //   }

  //   const project = UnwrapForTest(
  //     makeProject(
  //       makeFakeProject({
  //         nomRepresentantLegal: 'representant1',
  //       })
  //     )
  //   )

  //   const sendNotification = jest.fn(async (args: NotificationArgs) => null)
  //   const saveProjectAdmissionKey = jest.fn(async (args: ProjectAdmissionKey) =>
  //     ErrorResult<null>('oops')
  //   )
  //   const findProjectById = jest.fn(async (args) => project)
  //   const getPeriodeTitle = (jest.fn((appelOffreId, periodeId) =>
  //     okAsync({
  //       periodeTitle: 'periode1title',
  //       appelOffreTitle: 'appelOffre1title',
  //     })
  //   ) as unknown) as GetPeriodeTitle

  //   let candidateNotificationForPeriodeFailedEvent:
  //     | StoredEvent
  //     | undefined = undefined

  //   beforeAll((done) => {
  //     eventStore.subscribe(
  //       CandidateNotificationForPeriodeFailed.type,
  //       (event) => {
  //         candidateNotificationForPeriodeFailedEvent = event
  //         done()
  //       }
  //     )

  //     handleCandidateNotifiedForPeriode(eventStore, {
  //       sendNotification,
  //       saveProjectAdmissionKey,
  //       findProjectById,
  //       getPeriodeTitle,
  //     })

  //     eventStore.publish(
  //       new CandidateNotifiedForPeriode({
  //         payload: { ...fakePayload },
  //         requestId: 'request1',
  //       })
  //     )
  //   })

  //   it('should trigger CandidateNotificationForPeriodeFailed', () => {
  //     expect(candidateNotificationForPeriodeFailedEvent).toBeDefined()
  //     if (!candidateNotificationForPeriodeFailedEvent) return
  //     expect(candidateNotificationForPeriodeFailedEvent.payload).toEqual({
  //       ...fakePayload,
  //       error: '',
  //     })
  //     expect(candidateNotificationForPeriodeFailedEvent.requestId).toEqual(
  //       'request1'
  //     )
  //   })
  // })
})
