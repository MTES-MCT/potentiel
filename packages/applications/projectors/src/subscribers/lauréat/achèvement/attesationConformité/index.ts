import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';

import { attestationConformitéRebuildTriggered } from './attestationConformitéRebuildTriggered.projector';
import { attestationConformitéTransmiseProjector } from './attestationConformitéTransmise.projector';
import { attestationConformitéModifiéeProjector } from './attestationConformitéModifiée.projector';

export type SubscriptionEvent =
  | (Lauréat.Achèvement.AttestationConformité.AttestationConformitéEvent & Event)
  | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.AttestationConformité', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, attestationConformitéRebuildTriggered)
      .with({ type: 'AttestationConformitéTransmise-V1' }, attestationConformitéTransmiseProjector)
      .with({ type: 'AttestationConformitéModifiée-V1' }, attestationConformitéModifiéeProjector)
      .exhaustive();

  mediator.register('System.Projector.Lauréat.AttestationConformité', handler);
};
