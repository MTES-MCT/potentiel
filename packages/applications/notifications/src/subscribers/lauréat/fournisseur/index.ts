import { type Message, type MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import type { Event } from '@potentiel-infrastructure/pg-event-sourcing';

import { getLauréat } from '../../../helpers';
import type { SendEmail } from '../../../sendEmail';
import { changementFournisseurEnregistréNotifications } from './changementFournisseurEnregistré.notifications';
import { évaluationCarboneSimplifiéeModifiéeNotifications } from './évaluationCarboneSimplifiéeModifiée.notifications';

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
      .with({ type: 'ÉvaluationCarboneSimplifiéeModifiée-V1' }, async (event) =>
        évaluationCarboneSimplifiéeModifiéeNotifications({ sendEmail, event, projet }),
      )
      .with({ type: 'ChangementFournisseurEnregistré-V1' }, async (event) =>
        changementFournisseurEnregistréNotifications({ sendEmail, event, projet }),
      )
      .otherwise(() => Promise.resolve());
  };

  mediator.register('System.Notification.Lauréat.Fournisseur', handler);
};
