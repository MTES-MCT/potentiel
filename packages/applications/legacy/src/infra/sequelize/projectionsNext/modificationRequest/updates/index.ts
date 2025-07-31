import { EventBus } from '../../../../../core/domain';
import { logger } from '../../../../../core/utils';
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

  logger.info('Initialized ModificationRequest projections');
};

export * from './onModificationRequestCancelled';
