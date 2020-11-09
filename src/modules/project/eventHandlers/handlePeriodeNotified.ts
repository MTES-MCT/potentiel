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
    console.log(
      'handlePeriodeNotified, inside transaction found ',
      unnotifiedProjectIdsResult.value.length
    )
    unnotifiedProjectIdsResult.value.forEach(
      ({ projectId, candidateEmail, candidateName, familleId }) =>
        publish(
          new ProjectNotified({
            payload: {
              projectId,
              periodeId,
              familleId,
              appelOffreId,
              candidateEmail,
              candidateName,
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
