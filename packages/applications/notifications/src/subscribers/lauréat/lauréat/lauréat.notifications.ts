import { mediator, Message, MessageHandler } from 'mediateur';
import { match, P } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';

import { SendEmail } from '../../../sendEmail';

import { handleCahierDesChargesChoisi } from './handlers/cahierDesChargesChoisi.handler';

export type SubscriptionEvent = Lauréat.LauréatEvent & Event;

export type Execute = Message<'System.Notification.Lauréat', SubscriptionEvent>;

export type RegisterLauréatNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterLauréatNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with({ type: 'CahierDesChargesChoisi-V1' }, (event) =>
        handleCahierDesChargesChoisi({ event, sendEmail }),
      )
      .with(
        {
          type: P.union(
            'LauréatNotifié-V1',
            'LauréatNotifié-V2',
            'NomEtLocalitéLauréatImportés-V1',
            'NomProjetModifié-V1',
            'SiteDeProductionModifié-V1',
          ),
        },
        () => Promise.resolve(),
      )
      .exhaustive();

  mediator.register('System.Notification.Lauréat', handler);
};
