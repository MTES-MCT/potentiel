import { EventBus } from '../../../../../modules/eventStore'
import {
  ModificationRequested,
  ModificationRequestAccepted,
  ModificationRequestInstructionStarted,
} from '../../../../../modules/modificationRequest'
import { onModificationRequested } from './onModificationRequested'
import { onModificationRequestAccepted } from './onModificationRequestAccepted'
import { onModificationRequestInstructionStarted } from './onModificationRequestInstructionStarted'
import { logger } from '../../../../../core/utils'

export const initModificationRequestProjections = (eventBus: EventBus, models) => {
  eventBus.subscribe(ModificationRequested.type, onModificationRequested(models))
  eventBus.subscribe(ModificationRequestAccepted.type, onModificationRequestAccepted(models))
  eventBus.subscribe(
    ModificationRequestInstructionStarted.type,
    onModificationRequestInstructionStarted(models)
  )

  logger.info('Initialized ModificationRequest projections')
}
