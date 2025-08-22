import { type Message, type MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';
import type { Event, RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { abandonAccordéProjector } from './abandonAccordé.projector';
import { abandonAnnuléProjector } from './abandonAnnulé.projector';
import { abandonConfirméProjector } from './abandonConfirmé.projector';
import { abandonDemandéProjector } from './abandonDemandé.projector';
import { abandonPasséEnInstructionProjector } from './abandonPasséEnInstruction.projector';
import { abandonRebuildTriggered } from './abandonRebuildTriggered.projector';
import { abandonRejetéProjector } from './abandonRejeté.projector';
import { confirmationAbandonDemandéeProjector } from './confirmationAbandonDemandée.projector';
import { preuveCandidatureDemandéeProjector } from './preuveCandidatureDemandée.projector';
import { preuveCandidatureTransmiseProjector } from './preuveRecandidatureTransmise.projector';

export type SubscriptionEvent = (Lauréat.Abandon.AbandonEvent & Event) | RebuildTriggered;

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
