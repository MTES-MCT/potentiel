import { EventBus } from '../../../../../modules/eventStore'
import {
  ModificationRequested,
  ModificationRequestAccepted,
  ModificationRequestInstructionStarted,
  ModificationRequestRejected,
} from '../../../../../modules/modificationRequest'
import { onModificationRequested } from './onModificationRequested'
import { onModificationRequestAccepted } from './onModificationRequestAccepted'
import { onModificationRequestRejected } from './onModificationRequestRejected'
import { onModificationRequestInstructionStarted } from './onModificationRequestInstructionStarted'
import { logger } from '../../../../../core/utils'

export const initModificationRequestProjections = (eventBus: EventBus, models) => {
  eventBus.subscribe(ModificationRequested.type, onModificationRequested(models))
  eventBus.subscribe(ModificationRequestAccepted.type, onModificationRequestAccepted(models))
  eventBus.subscribe(ModificationRequestRejected.type, onModificationRequestRejected(models))
  eventBus.subscribe(
    ModificationRequestInstructionStarted.type,
    onModificationRequestInstructionStarted(models)
  )

  logger.info('Initialized ModificationRequest projections')
}
