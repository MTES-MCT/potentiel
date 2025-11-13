import { mediator, Message, MessageHandler } from 'mediateur';
import { match } from 'ts-pattern';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { getBaseUrl, getLauréat } from '#helpers';
import { SendEmail } from '#sendEmail';

import {
  handleDispositifDeStockageModifié,
  handleInstallateurModifié,
  handleTypologieInstallationModifiée,
  handleChangementInstallateurEnregistréNotification,
  handleChangementDispositifDeStockageEnregistréNotification,
} from './handlers/index.js';

export type SubscriptionEvent = Lauréat.Installation.InstallationEvent;

export type Execute = Message<'System.Notification.Lauréat.Installation', SubscriptionEvent>;

export type RegisterInstallationNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterInstallationNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      event.payload.identifiantProjet,
    );

    const baseUrl = getBaseUrl();

    const projet = await getLauréat(identifiantProjet.formatter());

    return match(event)
      .with({ type: 'InstallateurModifié-V1' }, async (event) =>
        handleInstallateurModifié({
          sendEmail,
          event,
          projet,
        }),
      )
      .with({ type: 'TypologieInstallationModifiée-V1' }, async (event) =>
        handleTypologieInstallationModifiée({
          sendEmail,
          event,
          projet,
        }),
      )
      .with({ type: 'DispositifDeStockageModifié-V1' }, async (event) =>
        handleDispositifDeStockageModifié({
          sendEmail,
          event,
          projet,
        }),
      )
      .with({ type: 'ChangementInstallateurEnregistré-V1' }, async (event) =>
        handleChangementInstallateurEnregistréNotification({
          sendEmail,
          event,
          projet,
          baseUrl,
        }),
      )
      .with({ type: 'ChangementDispositifDeStockageEnregistré-V1' }, async (event) =>
        handleChangementDispositifDeStockageEnregistréNotification({
          sendEmail,
          event,
          projet,
          baseUrl,
        }),
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
