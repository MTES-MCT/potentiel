import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Achèvement } from '@potentiel-domain/laureat';
import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';

import { achèvementRebuildTriggered } from './achèvementRebuildTriggered.projector';
import { attestationConformitéTransmiseProjector } from './attestationConformitéTransmise.projector';
import { attestationConformitéModifiéeProjector } from './attestationConformitéModifiée.projector';

export type SubscriptionEvent = (Achèvement.AchèvementEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.Achèvement', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, achèvementRebuildTriggered)
      .with({ type: 'AttestationConformitéTransmise-V1' }, attestationConformitéTransmiseProjector)
      .with({ type: 'AttestationConformitéModifiée-V1' }, attestationConformitéModifiéeProjector)
      .exhaustive();

  mediator.register('System.Projector.Lauréat.Achèvement', handler);
};
