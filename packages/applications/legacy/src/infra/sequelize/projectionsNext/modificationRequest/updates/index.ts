import { EventBus } from '../../../../../core/domain';
import { logger } from '../../../../../core/utils';
import {
  DélaiAccordé,
  DélaiAccordéCorrigé,
  DélaiAnnulé,
  DélaiDemandé,
  DélaiEnInstruction,
  DélaiRejeté,
  RejetDélaiAnnulé,
} from '../../../../../modules/demandeModification';
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
} from '../../../../../modules/modificationRequest';
import { onConfirmationRequested } from './onConfirmationRequested';
import { onLegacyModificationImported } from './onLegacyModificationImported';
import {
  onDélaiDemandé,
  onDélaiAnnulé,
  onDélaiRejeté,
  onDélaiAccordé,
  onRejetDélaiAnnulé,
  onDélaiEnInstruction,
  onDélaiAccordéCorrigé,
} from './délai';
import { onModificationReceived } from './onModificationReceived';
import { onModificationRequestAccepted } from './onModificationRequestAccepted';
import { onModificationRequestConfirmed } from './onModificationRequestConfirmed';
import { onModificationRequested } from './onModificationRequested';
import { onModificationRequestInstructionStarted } from './onModificationRequestInstructionStarted';
import { onModificationRequestRejected } from './onModificationRequestRejected';
import { onModificationRequestStatusUpdated } from './onModificationRequestStatusUpdated';

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
  eventBus.subscribe(DélaiAccordéCorrigé.type, onDélaiAccordéCorrigé);
  eventBus.subscribe(RejetDélaiAnnulé.type, onRejetDélaiAnnulé);
  eventBus.subscribe(DélaiEnInstruction.type, onDélaiEnInstruction);

  logger.info('Initialized ModificationRequest projections');
};

export * from './onModificationRequestCancelled';
