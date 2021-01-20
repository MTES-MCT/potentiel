import { okAsync } from 'neverthrow'
import { logger } from '../../../core/utils'
import { EventBus } from '../../eventStore'
import { ResponseTemplateDownloaded } from '../events'
import { ModificationRequestInstructionStarted } from '../events/ModificationRequestInstructionStarted'
import { GetModificationRequestStatus } from '../queries/GetModificationRequestStatus'

export const handleResponseTemplateDownloaded = (deps: {
  getModificationRequestStatus: GetModificationRequestStatus
  eventBus: EventBus
}) => async (event: ResponseTemplateDownloaded) => {
  const {
    payload: { modificationRequestId },
  } = event

  await deps
    .getModificationRequestStatus(modificationRequestId)
    .andThen((status) => {
      if (status === 'envoyée') {
        return deps.eventBus.publish(
          new ModificationRequestInstructionStarted({ payload: { modificationRequestId } })
        )
      }

      return okAsync(null)
    })
    .match(
      () => {},
      (e: Error) => {
        logger.error(e)
      }
    )
}
