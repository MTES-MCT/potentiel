import { EventStore } from '../../eventStore'
import {
  PeriodeNotified,
  PeriodeNotifiedPayload,
} from '../events/PeriodeNotified'
import { ProjectNotified } from '../events/ProjectNotified'
import { GetUnnotifiedProjectsForPeriode } from '../queries'

export const handlePeriodeNotified = (
  eventStore: EventStore,
  getUnnotifiedProjectsForPeriode: GetUnnotifiedProjectsForPeriode
) => {
  eventStore.subscribe(PeriodeNotified.type, async (event: PeriodeNotified) => {
    console.log('handlePeriodeNotified', event)
    const { periodeId, appelOffreId, notifiedOn } = event.payload

    const unnotifiedProjectIdsResult = await getUnnotifiedProjectsForPeriode(
      appelOffreId,
      periodeId
    )

    if (unnotifiedProjectIdsResult.isErr()) {
      // console.log(
      //   'handlePeriodeNotified failed to getUnnotifiedProjectsForPeriode',
      //   unnotifiedProjectIdsResult.error
      // )
      return
    }

    const result = await eventStore.transaction(({ publish }) => {
      // console.log(
      //   'publishing ProjectNotified events',
      //   unnotifiedProjectIdsResult.value
      // )
      unnotifiedProjectIdsResult.value.forEach(
        ({ projectId, candidateEmail, familleId }) =>
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
              aggregateId: projectId,
            })
          )
      )
    })

    if (result.isErr()) {
      console.log(
        'handlePeriodeNotified failed to publish events to eventStore',
        result.error
      )
    }
  })
}
