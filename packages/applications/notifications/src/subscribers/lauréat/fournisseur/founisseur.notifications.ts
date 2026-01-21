import { Message, MessageHandler, mediator } from 'mediateur';
import { match, P } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import {
  handleChangementFournisseurEnregistré,
  handleFournisseurModifié,
  handleÉvaluationCarboneSimplifiéeModifiée,
} from './handlers/index.js';

export type SubscriptionEvent = Lauréat.Fournisseur.FournisseurEvent;

export type Execute = Message<'System.Notification.Lauréat.Fournisseur', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    return match(event)
      .with(
        { type: 'ÉvaluationCarboneSimplifiéeModifiée-V1' },
        handleÉvaluationCarboneSimplifiéeModifiée,
      )
      .with({ type: 'ChangementFournisseurEnregistré-V1' }, handleChangementFournisseurEnregistré)
      .with({ type: 'FournisseurModifié-V1' }, handleFournisseurModifié)
      .with(
        {
          type: P.union('FournisseurImporté-V1'),
        },
        () => Promise.resolve(),
      )
      .exhaustive();
  };

  mediator.register('System.Notification.Lauréat.Fournisseur', handler);
};
