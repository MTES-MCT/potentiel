import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Event, RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';

import { installationAvecDispositifDeStockageImportéProjector } from './installationAvecDispositifDeStockageImporté.projector';
import { installationAvecDispositifDeStockageRebuilTriggeredProjector } from './installationAvecDispositifDeStockageRebuildTrigerred.projector';

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
        { type: 'InstallationAvecDispositifDeStockageImporté-V1' },
        installationAvecDispositifDeStockageImportéProjector,
      )
      .exhaustive();

  mediator.register('System.Projector.Lauréat.InstallationAvecDispositifDeStockage', handler);
};
