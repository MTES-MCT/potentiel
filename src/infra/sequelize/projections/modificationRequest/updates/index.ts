import { EventBus } from '@core/domain'
import { logger } from '@core/utils'
import {
  DélaiAccordé,
  DélaiAnnulé,
  DélaiDemandé,
  DélaiRejeté,
  RejetDemandeDélaiAnnulé,
} from '@modules/demandeModification'
import {
  ConfirmationRequested,
  LegacyModificationImported,
  ModificationReceived,
  ModificationRequestAccepted,
  ModificationRequestConfirmed,
  ModificationRequested,
  ModificationRequestInstructionStarted,
  ModificationRequestRejected,
  ModificationRequestStatusUpdated,
} from '@modules/modificationRequest'
import { onConfirmationRequested } from './onConfirmationRequested'
import { onDélaiAccordé } from './onDélaiAccordé'
import { onDélaiAnnulé } from './onDélaiAnnulé'
import { onDélaiDemandé } from './onDélaiDemandé'
import { onDélaiRejeté } from './onDélaiRejeté'
import { onLegacyModificationImported } from './onLegacyModificationImported'
import { onModificationReceived } from './onModificationReceived'
import { onModificationRequestAccepted } from './onModificationRequestAccepted'
import { onModificationRequestConfirmed } from './onModificationRequestConfirmed'
import { onModificationRequested } from './onModificationRequested'
import { onModificationRequestInstructionStarted } from './onModificationRequestInstructionStarted'
import { onModificationRequestRejected } from './onModificationRequestRejected'
import { onModificationRequestStatusUpdated } from './onModificationRequestStatusUpdated'
import { onRejetDemandeDélaiAnnulé } from './onRejetDemandeDélaiAnnulé'

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
  eventBus.subscribe(DélaiRejeté.type, onDélaiRejeté(models))
  eventBus.subscribe(DélaiAccordé.type, onDélaiAccordé(models))
  eventBus.subscribe(RejetDemandeDélaiAnnulé.type, onRejetDemandeDélaiAnnulé(models))
  logger.info('Initialized ModificationRequest projections')
}

export * from './onModificationRequestCancelled'
