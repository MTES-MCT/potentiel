import { type Message, type MessageHandler, mediator } from 'mediateur';
import { match, P } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';

import { handleChangementProducteurEnregistré, handleProducteurModifié } from './handlers/index.js';

export type SubscriptionEvent = Lauréat.Producteur.ProducteurEvent;

export type Execute = Message<'System.Notification.Lauréat.Producteur', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    return match(event)
      .with({ type: 'ChangementProducteurEnregistré-V1' }, handleChangementProducteurEnregistré)
      .with({ type: 'ProducteurModifié-V1' }, handleProducteurModifié)
      .with(
        {
          type: P.union('ProducteurImporté-V1', 'NuméroIdentificationCorrigé-V1'),
        },
        () => Promise.resolve(),
      )
      .exhaustive();
  };

  mediator.register('System.Notification.Lauréat.Producteur', handler);
};
