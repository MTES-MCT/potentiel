import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';

import { installationRebuildTriggeredProjector } from './installationRebuildTrigerred.projector.js';
import { installationImportéeProjector } from './installationImportée.projector.js';
import { installateurModifiéProjector } from './installateur/installateurModifié.projector.js';
import { typologieInstallationModifiéeProjector } from './typologie-de-installation/typologieInstallationModifiée.projector.js';
import { changementDispositifDeStockageEnregistréProjector } from './dispositif-de-stockage/changementDispositifDeStockageEnregistré.projector.js';
import { changementInstallateurEnregistréProjector } from './installateur/changementInstallateurEnregistré.projector.js';
import { dispositifDeStockageModifiéProjector } from './dispositif-de-stockage/dispositifDeStockageModifié.projector.js';

export type SubscriptionEvent = Lauréat.Installation.InstallationEvent | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.Installation', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, installationRebuildTriggeredProjector)
      .with({ type: 'InstallationImportée-V1' }, installationImportéeProjector)
      .with({ type: 'InstallateurModifié-V1' }, installateurModifiéProjector)
      .with({ type: 'TypologieInstallationModifiée-V1' }, typologieInstallationModifiéeProjector)
      .with({ type: 'DispositifDeStockageModifié-V1' }, dispositifDeStockageModifiéProjector)
      .with(
        { type: 'ChangementInstallateurEnregistré-V1' },
        changementInstallateurEnregistréProjector,
      )
      .with(
        { type: 'ChangementDispositifDeStockageEnregistré-V1' },
        changementDispositifDeStockageEnregistréProjector,
      )
      .exhaustive();

  mediator.register('System.Projector.Lauréat.Installation', handler);
};
