import { EventStore } from '../../eventStore'
import { PeriodeNotified } from '../events/PeriodeNotified'
import { ProjectNotified } from '../events/ProjectNotified'
import { GetUnnotifiedProjectsForPeriode } from '../queries'

export const handlePeriodeNotified = (deps: {
  eventStore: EventStore
  getUnnotifiedProjectsForPeriode: GetUnnotifiedProjectsForPeriode
}) => async (event: PeriodeNotified) => {
  const { eventStore, getUnnotifiedProjectsForPeriode } = deps

  const { periodeId, appelOffreId, notifiedOn } = event.payload

  const unnotifiedProjectIdsResult = await getUnnotifiedProjectsForPeriode(appelOffreId, periodeId)

  if (unnotifiedProjectIdsResult.isErr()) {
    return
  }

  const result = await eventStore.transaction(({ publish }) => {
    unnotifiedProjectIdsResult.value.forEach(({ projectId, candidateEmail, familleId }) =>
      publish(
        new ProjectNotified({
          payload: {
            projectId,
            periodeId,
            familleId,
            appelOffreId,
            candidateEmail,
            notifiedOn,
          },
          requestId: event.requestId,
        })
      )
    )
  })

  if (result.isErr()) {
    console.log('handlePeriodeNotified failed to publish events to eventStore', result.error)
  }
}
