import { okAsync } from '../../../core/utils'
import { InfraNotAvailableError } from '../../shared'
import { InMemoryEventStore } from '../../../infra/inMemory'

import { handlePeriodeNotified } from './'
import { PeriodeNotified, ProjectNotified } from '../events'
import { UnnotifiedProjectDTO } from '../queries'

describe('handlePeriodeNotified', () => {
  const eventStore = new InMemoryEventStore()

  const getUnnotifiedProjectsForPeriode = jest.fn(
    (appelOffreId: string, periodeId: string) =>
      okAsync<UnnotifiedProjectDTO[], InfraNotAvailableError>(
        ['project1', 'project2'].map((projectId) => ({
          projectId,
          candidateEmail: 'email',
          familleId: 'famille',
        }))
      )
  )

  const caughtProjectNotifiedEvents: ProjectNotified[] = []
  const fakePayload = {
    periodeId: 'periode1',
    familleId: 'famille',
    appelOffreId: 'appelOffre1',
    notifiedOn: 1,
  }

  beforeAll((done) => {
    handlePeriodeNotified(eventStore, getUnnotifiedProjectsForPeriode)

    let counter = 0
    eventStore.subscribe(ProjectNotified.type, (event: ProjectNotified) => {
      caughtProjectNotifiedEvents.push(event)
      if (++counter == 2) {
        done()
      }
    })

    eventStore.publish(
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

    expect(caughtProjectNotifiedEvents).toHaveLength(2)
    expect(caughtProjectNotifiedEvents[0].payload).toEqual({
      ...fakePayload,
      projectId: 'project1',
      candidateEmail: 'email',
    })
    expect(caughtProjectNotifiedEvents[1].payload).toEqual({
      ...fakePayload,
      projectId: 'project2',
      candidateEmail: 'email',
    })
    expect(
      caughtProjectNotifiedEvents.every(
        (event) => event.requestId === 'request1'
      )
    ).toBe(true)
  })
})
