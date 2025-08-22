import { type Message, type MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';
import type { Event, RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { achèvementRebuildTriggered } from './achèvementRebuildTriggered.projector';
import { attestationConformitéModifiéeProjector } from './attestationConformité/attestationConformitéModifiée.projector';
import { attestationConformitéTransmiseProjector } from './attestationConformité/attestationConformitéTransmise.projector';
import { dateAchèvementPrévisionnelCalculéeProjector } from './dateAchèvementPrévisionnelCalculéeProjector';

export type SubscriptionEvent = (Lauréat.Achèvement.AchèvementEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.Achèvement', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, achèvementRebuildTriggered)
      .with({ type: 'AttestationConformitéTransmise-V1' }, attestationConformitéTransmiseProjector)
      .with({ type: 'AttestationConformitéModifiée-V1' }, attestationConformitéModifiéeProjector)
      .with(
        { type: 'DateAchèvementPrévisionnelCalculée-V1' },
        dateAchèvementPrévisionnelCalculéeProjector,
      )
      .exhaustive();

  mediator.register('System.Projector.Lauréat.Achèvement', handler);
};
