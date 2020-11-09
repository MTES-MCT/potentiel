import { okAsync, ResultAsync } from '../../../core/utils'
import { makeCandidateNotificationId } from '../../candidateNotification/CandidateNotification'
import { EventStore, EventStoreTransactionArgs, StoredEvent } from '../../eventStore'
import { InfraNotAvailableError } from '../../shared'
import { PeriodeNotified, ProjectNotified } from '../events'
import { UnnotifiedProjectDTO } from '../queries'
import { handlePeriodeNotified } from './'

describe('handlePeriodeNotified', () => {
  const getUnnotifiedProjectsForPeriode = jest.fn((appelOffreId: string, periodeId: string) =>
    okAsync<UnnotifiedProjectDTO[], InfraNotAvailableError>(
      ['project1', 'project2'].map((projectId) => ({
        projectId,
        candidateEmail: 'email',
        candidateName: 'john doe',
        familleId: 'famille',
      }))
    )
  )

  const fakePayload = {
    periodeId: 'periode1',
    familleId: 'famille',
    appelOffreId: 'appelOffre1',
    notifiedOn: 1,
  }

  const publish = jest.fn((event: StoredEvent) => okAsync<null, InfraNotAvailableError>(null))

  const eventStore: EventStore = {
    publish: jest.fn(),
    subscribe: jest.fn(),
    transaction: <T>(fn: (args: EventStoreTransactionArgs) => T) => {
      return ResultAsync.fromPromise(
        Promise.resolve(fn({ loadHistory: jest.fn(), publish })),
        () => new InfraNotAvailableError()
      )
    },
  }

  beforeAll(async () => {
    publish.mockClear()
    await handlePeriodeNotified({
      eventStore,
      getUnnotifiedProjectsForPeriode,
    })(
      new PeriodeNotified({
        payload: { ...fakePayload, requestedBy: 'user1' },
        requestId: 'request1',
      })
    )
  })

  it('should trigger a ProjectNotified event for each unnotified project of this periode', () => {
    expect(getUnnotifiedProjectsForPeriode).toHaveBeenCalledWith(
      fakePayload.appelOffreId,
      fakePayload.periodeId
    )

    expect(publish).toHaveBeenCalledTimes(2)

    expect(publish.mock.calls.every((call) => call[0].type === ProjectNotified.type)).toBe(true)

    const project1Event = publish.mock.calls
      .map((call) => call[0])
      .find((event) => (event.payload as any).projectId === 'project1')
    expect(project1Event).toBeDefined()
    expect(project1Event!.payload).toEqual({
      ...fakePayload,
      projectId: 'project1',
      candidateEmail: 'email',
      candidateName: 'john doe',
    })
    expect(project1Event!.aggregateId).toEqual(
      expect.arrayContaining([
        makeCandidateNotificationId({
          appelOffreId: fakePayload.appelOffreId,
          periodeId: fakePayload.periodeId,
          candidateEmail: 'email',
        }),
      ])
    )

    const project2Event = publish.mock.calls
      .map((call) => call[0])
      .find((event) => (event.payload as any).projectId === 'project2')
    expect(project2Event).toBeDefined()
    expect(project2Event!.payload).toEqual({
      ...fakePayload,
      projectId: 'project2',
      candidateEmail: 'email',
      candidateName: 'john doe',
    })
    expect(project2Event!.aggregateId).toEqual(
      expect.arrayContaining([
        makeCandidateNotificationId({
          appelOffreId: fakePayload.appelOffreId,
          periodeId: fakePayload.periodeId,
          candidateEmail: 'email',
        }),
      ])
    )

    expect(publish.mock.calls.every((call) => call[0].requestId === 'request1')).toBe(true)
  })
})
