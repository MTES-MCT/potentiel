import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';

import { producteurRebuilTriggeredProjector } from './producteurRebuildTrigerred.projector';
import { changementProducteurEnregistréProjector } from './changementProducteurEnregistré.projector';
import { producteurModifiéProjector } from './producteurModifié.projector';
import { producteurImportéProjector } from './producteurImporté.projector';

export type SubscriptionEvent = Lauréat.Producteur.ProducteurEvent | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.Producteur', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, producteurRebuilTriggeredProjector)
      .with({ type: 'ChangementProducteurEnregistré-V1' }, changementProducteurEnregistréProjector)
      .with({ type: 'ProducteurModifié-V1' }, producteurModifiéProjector)
      .with({ type: 'ProducteurImporté-V1' }, producteurImportéProjector)
      .exhaustive();

  mediator.register('System.Projector.Lauréat.Producteur', handler);
};
