import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Event, RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';

import { installationAvecDispositifDeStockageImportéeProjector } from './installationAvecDispositifDeStockageImportée.projector';
import { installationAvecDispositifDeStockageRebuilTriggeredProjector } from './installationAvecDispositifDeStockageRebuildTrigerred.projector';
import { installationAvecDispositifDeStockageModifiéeProjector } from './installationAvecDispositifDeStockageModifiée.projector';

export type SubscriptionEvent = (
  | Lauréat.InstallationAvecDispositifDeStockage.InstallationAvecDispositifDeStockageEvent
  | RebuildTriggered
) &
  Event;

export type Execute = Message<
  'System.Projector.Lauréat.InstallationAvecDispositifDeStockage',
  SubscriptionEvent
>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with(
        { type: 'RebuildTriggered' },
        installationAvecDispositifDeStockageRebuilTriggeredProjector,
      )
      .with(
        { type: 'InstallationAvecDispositifDeStockageImportée-V1' },
        installationAvecDispositifDeStockageImportéeProjector,
      )
      .with(
        { type: 'InstallationAvecDispositifDeStockageModifiée-V1' },
        installationAvecDispositifDeStockageModifiéeProjector,
      )
      .exhaustive();

  mediator.register('System.Projector.Lauréat.InstallationAvecDispositifDeStockage', handler);
};
