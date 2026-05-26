import { type Message, type MessageHandler, mediator } from 'mediateur';
import { match, P } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';
import type { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { achèvementModifiéProjector } from './achèvementModifié.projector.js';
import { achèvementRebuildTriggered } from './achèvementRebuildTriggered.projector.js';
import { attestationConformitéEnregistréeProjector } from './attestationConformité/attestationConformitéEnregistrée.projector.js';
import { attestationConformitéModifiéeProjector } from './attestationConformité/attestationConformitéModifiée.projector.js';
import { attestationConformitéTransmiseProjector } from './attestationConformité/attestationConformitéTransmise.projector.js';
import { dateAchèvementPrévisionnelCalculéeProjector } from './dateAchèvementPrévisionnelCalculéeProjector.js';
import { dateAchèvementTransmiseProjector } from './dateAchèvementTransmise.projector.js';

export type SubscriptionEvent = Lauréat.Achèvement.AchèvementEvent | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.Achèvement', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, achèvementRebuildTriggered)
      .with(
        { type: P.union('AttestationConformitéTransmise-V1', 'AttestationConformitéTransmise-V2') },
        attestationConformitéTransmiseProjector,
      )
      .with(
        { type: P.union('AttestationConformitéModifiée-V1', 'AttestationConformitéModifiée-V2') },
        attestationConformitéModifiéeProjector,
      )
      .with(
        { type: P.union('AchèvementModifié-V1', 'AchèvementModifié-V2') },
        achèvementModifiéProjector,
      )
      .with(
        {
          type: P.union(
            'AttestationConformitéEnregistrée-V1',
            'AttestationConformitéEnregistrée-V2',
          ),
        },
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
