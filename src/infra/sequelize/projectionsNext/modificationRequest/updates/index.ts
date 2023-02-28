import { EventBus } from '@core/domain';
import { logger } from '@core/utils';
import {
  AbandonAnnulé,
  DélaiAccordé,
  DélaiAnnulé,
  DélaiDemandé,
  DélaiEnInstruction,
  DélaiRejeté,
  RejetDélaiAnnulé,
  RejetRecoursAnnulé,
  RejetChangementDePuissanceAnnulé,
  AbandonDemandé,
  AbandonAccordé,
  AbandonRejeté,
  ConfirmationAbandonDemandée,
  AbandonConfirmé,
  RejetAbandonAnnulé,
  AnnulationAbandonDemandée,
  AnnulationAbandonAnnulée,
  AnnulationAbandonRejetée,
  AnnulationAbandonAccordée,
} from '@modules/demandeModification';
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
} from '@modules/modificationRequest';
import { onConfirmationRequested } from './onConfirmationRequested';
import { onLegacyModificationImported } from './onLegacyModificationImported';
import { LegacyAbandonSupprimé } from '@modules/project';
import {
  onAbandonDemandé,
  onAbandonAnnulé,
  onAbandonConfirmé,
  onAbandonAccordé,
  onAbandonRejeté,
  onLegacyAbandonSupprimé,
  onConfirmationAbandonDemandée,
  onRejetAbandonAnnulé,
} from './abandon';
import {
  onAnnulationAbandonDemandée,
  onAnnulationAbandonAnnulée,
  onAnnulationAbandonRejetée,
  onAnnulationAbandonAccordée,
} from './annulationAbandon';
import {
  onDélaiDemandé,
  onDélaiAnnulé,
  onDélaiRejeté,
  onDélaiAccordé,
  onRejetDélaiAnnulé,
  onDélaiEnInstruction,
} from './délai';
import { onModificationReceived } from './onModificationReceived';
import { onModificationRequestAccepted } from './onModificationRequestAccepted';
import { onModificationRequestConfirmed } from './onModificationRequestConfirmed';
import { onModificationRequested } from './onModificationRequested';
import { onModificationRequestInstructionStarted } from './onModificationRequestInstructionStarted';
import { onModificationRequestRejected } from './onModificationRequestRejected';
import { onModificationRequestStatusUpdated } from './onModificationRequestStatusUpdated';
import { onRejetChangementDePuissanceAnnulé } from './onRejetChangementDePuissanceAnnulé';
import { onRejetRecoursAnnulé } from './onRejetRecoursAnnulé';

export const initModificationRequestProjections = (eventBus: EventBus, models) => {
  eventBus.subscribe(ModificationRequested.type, onModificationRequested);
  eventBus.subscribe(ConfirmationRequested.type, onConfirmationRequested);
  eventBus.subscribe(ModificationRequestConfirmed.type, onModificationRequestConfirmed);
  eventBus.subscribe(ModificationRequestAccepted.type, onModificationRequestAccepted);
  eventBus.subscribe(ModificationRequestRejected.type, onModificationRequestRejected);
  eventBus.subscribe(
    ModificationRequestInstructionStarted.type,
    onModificationRequestInstructionStarted,
  );
  eventBus.subscribe(ModificationRequestStatusUpdated.type, onModificationRequestStatusUpdated);

  eventBus.subscribe(ModificationReceived.type, onModificationReceived);
  eventBus.subscribe(LegacyModificationImported.type, onLegacyModificationImported);

  eventBus.subscribe(DélaiDemandé.type, onDélaiDemandé);
  eventBus.subscribe(DélaiAnnulé.type, onDélaiAnnulé);
  eventBus.subscribe(DélaiRejeté.type, onDélaiRejeté);
  eventBus.subscribe(DélaiAccordé.type, onDélaiAccordé);
  eventBus.subscribe(RejetDélaiAnnulé.type, onRejetDélaiAnnulé);
  eventBus.subscribe(DélaiEnInstruction.type, onDélaiEnInstruction);

  eventBus.subscribe(RejetRecoursAnnulé.type, onRejetRecoursAnnulé);
  eventBus.subscribe(RejetChangementDePuissanceAnnulé.type, onRejetChangementDePuissanceAnnulé);
  eventBus.subscribe(AbandonDemandé.type, onAbandonDemandé);
  eventBus.subscribe(AbandonAnnulé.type, onAbandonAnnulé);
  eventBus.subscribe(AbandonConfirmé.type, onAbandonConfirmé);
  eventBus.subscribe(AbandonAccordé.type, onAbandonAccordé);
  eventBus.subscribe(AbandonRejeté.type, onAbandonRejeté);
  eventBus.subscribe(LegacyAbandonSupprimé.type, onLegacyAbandonSupprimé);
  eventBus.subscribe(ConfirmationAbandonDemandée.type, onConfirmationAbandonDemandée);
  eventBus.subscribe(RejetAbandonAnnulé.type, onRejetAbandonAnnulé);
  eventBus.subscribe(AnnulationAbandonDemandée.type, onAnnulationAbandonDemandée);
  eventBus.subscribe(AnnulationAbandonAnnulée.type, onAnnulationAbandonAnnulée);
  eventBus.subscribe(AnnulationAbandonRejetée.type, onAnnulationAbandonRejetée);
  eventBus.subscribe(AnnulationAbandonAccordée.type, onAnnulationAbandonAccordée);
  logger.info('Initialized ModificationRequest projections');
};

export * from './onModificationRequestCancelled';
