import {
  ModificationRequested,
  ModificationRequestAccepted,
  ModificationRequestInstructionStarted,
  ModificationRequestRejected,
  ModificationRequestStatusUpdated,
  ConfirmationRequested,
  ModificationRequestConfirmed,
  ModificationReceived,
  LegacyModificationImported,
} from '@modules/modificationRequest'
import { onModificationRequested } from './onModificationRequested'
import { onModificationRequestAccepted } from './onModificationRequestAccepted'
import { onModificationRequestRejected } from './onModificationRequestRejected'
import { onModificationRequestStatusUpdated } from './onModificationRequestStatusUpdated'
import { onConfirmationRequested } from './onConfirmationRequested'
import { onModificationRequestConfirmed } from './onModificationRequestConfirmed'
import { onModificationRequestInstructionStarted } from './onModificationRequestInstructionStarted'
import { logger } from '@core/utils'
import { onModificationReceived } from './onModificationReceived'
import { onLegacyModificationImported } from './onLegacyModificationImported'
import { EventBus } from '@core/domain'
import { onDélaiDemandé } from './onDélaiDemandé'
import { onDélaiAnnulé } from './onDélaiAnnulé'
import { DélaiAnnulé, DélaiDemandé } from '@modules/demandeModification'

export const initModificationRequestProjections = (eventBus: EventBus, models) => {
  eventBus.subscribe(ModificationRequested.type, onModificationRequested(models))
  eventBus.subscribe(ConfirmationRequested.type, onConfirmationRequested(models))
  eventBus.subscribe(ModificationRequestConfirmed.type, onModificationRequestConfirmed(models))
  eventBus.subscribe(ModificationRequestAccepted.type, onModificationRequestAccepted(models))
  eventBus.subscribe(ModificationRequestRejected.type, onModificationRequestRejected(models))
  eventBus.subscribe(
    ModificationRequestInstructionStarted.type,
    onModificationRequestInstructionStarted(models)
  )
  eventBus.subscribe(
    ModificationRequestStatusUpdated.type,
    onModificationRequestStatusUpdated(models)
  )

  eventBus.subscribe(ModificationReceived.type, onModificationReceived(models))
  eventBus.subscribe(LegacyModificationImported.type, onLegacyModificationImported(models))

  eventBus.subscribe(DélaiDemandé.type, onDélaiDemandé(models))
  eventBus.subscribe(DélaiAnnulé.type, onDélaiAnnulé(models))
  logger.info('Initialized ModificationRequest projections')
}

export * from './onModificationRequestCancelled'
