import { mediator, Message, MessageHandler } from 'mediateur';
import { match, P } from 'ts-pattern';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { getBaseUrl, getLauréat } from '../../../_helpers';
import { SendEmail } from '../../../sendEmail';

import { handleChangementProducteurEnregistré, handleProducteurModifié } from './handlers';

export type SubscriptionEvent = Lauréat.Producteur.ProducteurEvent;

export type Execute = Message<'System.Notification.Lauréat.Producteur', SubscriptionEvent>;

export type RegisterProducteurNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterProducteurNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      event.payload.identifiantProjet,
    );

    const projet = await getLauréat(identifiantProjet.formatter());

    const baseUrl = getBaseUrl();

    return match(event)
      .with({ type: 'ProducteurModifié-V1' }, async (event) =>
        handleProducteurModifié({
          sendEmail,
          event,
          projet,
        }),
      )
      .with({ type: 'ChangementProducteurEnregistré-V1' }, async (event) =>
        handleChangementProducteurEnregistré({
          sendEmail,
          event,
          projet,
          baseUrl,
        }),
      )
      .with(
        {
          type: P.union('ProducteurImporté-V1'),
        },
        () => Promise.resolve(),
      )
      .exhaustive();
  };

  mediator.register('System.Notification.Lauréat.Producteur', handler);
};
