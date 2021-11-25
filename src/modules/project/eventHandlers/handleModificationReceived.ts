import moment from 'moment'
import { ProjectGFDueDateSet } from '..'
import { EventBus } from '../../../core/domain'
import { logger, okAsync, ResultAsync } from '../../../core/utils'
import { ModificationReceived } from '../../modificationRequest'
import { InfraNotAvailableError } from '../../shared'
import { ProjectGFInvalidated } from '../events'

export const handleModificationReceived = (deps: { eventBus: EventBus }) => async (
  event: ModificationReceived
): Promise<ResultAsync<null, InfraNotAvailableError>> => {
  const { eventBus } = deps
  const { projectId, type } = event.payload
  const { requestId } = event

  if (type !== 'producteur') return okAsync(null)

  return eventBus
    .publish(
      new ProjectGFDueDateSet({
        payload: {
          projectId: projectId.toString(),
          garantiesFinancieresDueOn: moment(event.occurredAt).add(1, 'months').toDate().getTime(),
        },
        requestId,
      })
    )
    .andThen(() => {
      return eventBus.publish(
        new ProjectGFInvalidated({
          payload: {
            projectId: projectId.toString(),
          },
          requestId,
        })
      )
    })
    .mapErr((err: Error) => {
      logger.error(err)
      return new InfraNotAvailableError()
    })
}
