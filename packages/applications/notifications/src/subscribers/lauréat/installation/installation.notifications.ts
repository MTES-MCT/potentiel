import { mediator, Message, MessageHandler } from 'mediateur';
import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import {
  handleDispositifDeStockageModifié,
  handleInstallateurModifié,
  handleTypologieInstallationModifiée,
  handleChangementInstallateurEnregistré,
  handleChangementDispositifDeStockageEnregistré,
} from './handlers/index.js';

export type SubscriptionEvent = Lauréat.Installation.InstallationEvent;

export type Execute = Message<'System.Notification.Lauréat.Installation', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    return match(event)
      .with({ type: 'InstallateurModifié-V1' }, handleInstallateurModifié)
      .with({ type: 'TypologieInstallationModifiée-V1' }, handleTypologieInstallationModifiée)
      .with({ type: 'DispositifDeStockageModifié-V1' }, handleDispositifDeStockageModifié)
      .with({ type: 'ChangementInstallateurEnregistré-V1' }, handleChangementInstallateurEnregistré)
      .with(
        { type: 'ChangementDispositifDeStockageEnregistré-V1' },
        handleChangementDispositifDeStockageEnregistré,
      )
      .with(
        {
          type: 'InstallationImportée-V1',
        },
        () => Promise.resolve(),
      )
      .exhaustive();
  };

  mediator.register('System.Notification.Lauréat.Installation', handler);
};
