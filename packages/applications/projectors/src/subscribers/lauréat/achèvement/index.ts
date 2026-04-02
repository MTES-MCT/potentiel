import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';

import { attestationConformitéTransmiseProjector } from './attestationConformité/attestationConformitéTransmise.projector.js';
import { achèvementModifiéProjector } from './achèvementModifié.projector.js';
import { achèvementRebuildTriggered } from './achèvementRebuildTriggered.projector.js';
import { dateAchèvementPrévisionnelCalculéeProjector } from './dateAchèvementPrévisionnelCalculéeProjector.js';
import { dateAchèvementTransmiseProjector } from './dateAchèvementTransmise.projector.js';
import { attestationConformitéEnregistréeProjector } from './attestationConformité/attestationConformitéEnregistrée.projector.js';
import { attestationConformitéModifiéeProjector } from './attestationConformité/attestationConformitéModifiée.projector.js';

export type SubscriptionEvent = Lauréat.Achèvement.AchèvementEvent | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.Achèvement', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, achèvementRebuildTriggered)
      .with({ type: 'AttestationConformitéTransmise-V1' }, attestationConformitéTransmiseProjector)
      .with({ type: 'AttestationConformitéModifiée-V1' }, attestationConformitéModifiéeProjector)
      .with({ type: 'AchèvementModifié-V1' }, achèvementModifiéProjector)
      .with(
        { type: 'AttestationConformitéEnregistrée-V1' },
        attestationConformitéEnregistréeProjector,
      )
      .with(
        { type: 'DateAchèvementPrévisionnelCalculée-V1' },
        dateAchèvementPrévisionnelCalculéeProjector,
      )
      .with({ type: 'DateAchèvementTransmise-V1' }, dateAchèvementTransmiseProjector)
      .exhaustive();

  mediator.register('System.Projector.Lauréat.Achèvement', handler);
};
