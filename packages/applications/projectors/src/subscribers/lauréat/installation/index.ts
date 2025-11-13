import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';

import { installationRebuilTriggeredProjector } from './installationRebuildTrigerred.projector';
import { installationImportéeProjector } from './installationImportée.projector';
import { installateurModifiéProjector } from './installateurModifié.projector';
import { typologieInstallationModifiéeProjector } from './typologieInstallationModifiée.projector';
import { dispositifDeStockageModifiéProjector } from './dispositifDeStockageModifié.projector';

export type SubscriptionEvent = Lauréat.Installation.InstallationEvent | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.Installation', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, installationRebuilTriggeredProjector)
      .with({ type: 'InstallationImportée-V1' }, installationImportéeProjector)
      .with({ type: 'InstallateurModifié-V1' }, installateurModifiéProjector)
      .with({ type: 'TypologieInstallationModifiée-V1' }, typologieInstallationModifiéeProjector)
      .with({ type: 'DispositifDeStockageModifié-V1' }, dispositifDeStockageModifiéProjector)
      .exhaustive();

  mediator.register('System.Projector.Lauréat.Installation', handler);
};
