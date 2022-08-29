import { EventBus } from '@core/domain'
import { logger } from '@core/utils'
import {
  AbandonAnnulé,
  DélaiAccordé,
  DélaiAnnulé,
  DélaiDemandé,
  DélaiEnInstruction,
  DélaiRejeté,
  RejetDélaiAnnulé,
  RejetRecoursAnnulé,
  AbandonDemandé,
  AbandonAccordé,
  AbandonRejeté,
  ConfirmationAbandonDemandée,
  AbandonConfirmé,
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
import { onDélaiEnInstruction } from './onDélaiEnInstruction'
import { onDélaiRejeté } from './onDélaiRejeté'
import { onLegacyModificationImported } from './onLegacyModificationImported'
import { onModificationReceived } from './onModificationReceived'
import { onModificationRequestAccepted } from './onModificationRequestAccepted'
import { onModificationRequestConfirmed } from './onModificationRequestConfirmed'
import { onModificationRequested } from './onModificationRequested'
import { onModificationRequestInstructionStarted } from './onModificationRequestInstructionStarted'
import { onModificationRequestRejected } from './onModificationRequestRejected'
import { onModificationRequestStatusUpdated } from './onModificationRequestStatusUpdated'
import { onRejetDélaiAnnulé } from './onRejetDélaiAnnulé'
import { onRejetRecoursAnnulé } from './onRejetRecoursAnnulé'
import {
  onAbandonRejeté,
  onAbandonDemandé,
  onAbandonAnnulé,
  onAbandonAccordé,
  onConfirmationAbandonDemandée,
  onAbandonConfirmé,
} from './abandon'

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
  eventBus.subscribe(RejetDélaiAnnulé.type, onRejetDélaiAnnulé(models))
  eventBus.subscribe(DélaiEnInstruction.type, onDélaiEnInstruction(models))

  eventBus.subscribe(RejetRecoursAnnulé.type, onRejetRecoursAnnulé(models))
  eventBus.subscribe(AbandonDemandé.type, onAbandonDemandé(models))
  eventBus.subscribe(AbandonAnnulé.type, onAbandonAnnulé(models))
  eventBus.subscribe(AbandonConfirmé.type, onAbandonConfirmé(models))
  eventBus.subscribe(AbandonAccordé.type, onAbandonAccordé(models))
  eventBus.subscribe(AbandonRejeté.type, onAbandonRejeté(models))
  eventBus.subscribe(ConfirmationAbandonDemandée.type, onConfirmationAbandonDemandée(models))
  logger.info('Initialized ModificationRequest projections')
}

export * from './onModificationRequestCancelled'
