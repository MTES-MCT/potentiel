import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';

import { SendEmail } from '../../../sendEmail';
import { getLauréat } from '../../../helpers';

import { changementFournisseurEnregistréNotifications } from './changementFournisseurEnregistré.notifications';

export type SubscriptionEvent = Lauréat.Fournisseur.FournisseurEvent & Event;

export type Execute = Message<'System.Notification.Lauréat.Fournisseur', SubscriptionEvent>;

export type RegisterFournisseurNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterFournisseurNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      event.payload.identifiantProjet,
    );
    const projet = await getLauréat(identifiantProjet.formatter());

    return match(event)
      .with({ type: 'ChangementFournisseurEnregistré-V1' }, async (event) =>
        changementFournisseurEnregistréNotifications({ sendEmail, event, projet }),
      )
      .otherwise(() => Promise.resolve());
  };

  mediator.register('System.Notification.Lauréat.Fournisseur', handler);
};
