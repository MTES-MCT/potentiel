import { mediator, Message, MessageHandler } from 'mediateur';
import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { SendEmail } from '#sendEmail';

import { handleCahierDesChargesChoisi } from './handlers/cahierDesChargesChoisi.handler.js';
import { handleChangementNomProjetEnregistré } from './handlers/changementNomProjetEnregistré.handler.js';
import { handleLauréatNotifié } from './handlers/lauréatNotifié.handler.js';
import { handleNomProjetModifié } from './handlers/nomProjetModifié.handler.js';

export type SubscriptionEvent =
  | Lauréat.CahierDesChargesChoisiEvent
  | Lauréat.ChangementNomProjetEnregistréEvent
  | Lauréat.LauréatNotifiéEvent
  | Lauréat.NomProjetModifiéEvent;

export type Execute = Message<'System.Notification.Lauréat', SubscriptionEvent>;

export type RegisterLauréatNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterLauréatNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    return await match(event)
      .with({ type: 'LauréatNotifié-V2' }, (event) => handleLauréatNotifié({ sendEmail, event }))
      .with({ type: 'CahierDesChargesChoisi-V1' }, (event) =>
        handleCahierDesChargesChoisi({ sendEmail, event }),
      )
      .with({ type: 'ChangementNomProjetEnregistré-V1' }, (event) =>
        handleChangementNomProjetEnregistré({ sendEmail, event }),
      )
      .with({ type: 'NomProjetModifié-V1' }, (event) =>
        handleNomProjetModifié({ sendEmail, event }),
      )
      .exhaustive();
  };

  mediator.register('System.Notification.Lauréat', handler);
};
