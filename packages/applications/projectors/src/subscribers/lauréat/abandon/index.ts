import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { AbandonBen } from '@potentiel-domain/laureat';

import { abandonRebuildTriggered } from './abandonRebuildTriggered.projector';
import { abandonDemandéProjector } from './abandonDemandé.projector';
import { abandonAccordéProjector } from './abandonAccordé.projector';
import { abandonRejetéProjector } from './abandonRejeté.projector';
import { abandonAnnuléProjector } from './abandonAnnulé.projector';
import { abandonConfirméProjector } from './abandonConfirmé.projector';
import { confirmationAbandonDemandéeProjector } from './confirmationAbandonDemandée.projector';
import { preuveCandidatureDemandéeProjector } from './preuveCandidatureDemandée.projector';
import { preuveCandidatureTransmiseProjector } from './preuveRecandidatureTransmise.projector';
import { abandonPasséEnInstructionProjector } from './abandonPasséEnInstruction.projector';

export type SubscriptionEvent = (AbandonBen.AbandonEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.Abandon', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, abandonRebuildTriggered)
      .with({ type: 'AbandonDemandé-V1' }, abandonDemandéProjector)
      .with({ type: 'AbandonDemandé-V2' }, abandonDemandéProjector)
      .with({ type: 'AbandonAccordé-V1' }, abandonAccordéProjector)
      .with({ type: 'AbandonRejeté-V1' }, abandonRejetéProjector)
      .with({ type: 'AbandonAnnulé-V1' }, abandonAnnuléProjector)
      .with({ type: 'AbandonConfirmé-V1' }, abandonConfirméProjector)
      .with({ type: 'AbandonPasséEnInstruction-V1' }, abandonPasséEnInstructionProjector)
      .with({ type: 'ConfirmationAbandonDemandée-V1' }, confirmationAbandonDemandéeProjector)
      .with({ type: 'PreuveRecandidatureDemandée-V1' }, preuveCandidatureDemandéeProjector)
      .with({ type: 'PreuveRecandidatureTransmise-V1' }, preuveCandidatureTransmiseProjector)
      .exhaustive();

  mediator.register('System.Projector.Lauréat.Abandon', handler);
};
