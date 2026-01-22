import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';

import { producteurRebuildTriggeredProjector } from './producteurRebuildTrigerred.projector.js';
import { changementProducteurEnregistréProjector } from './changementProducteurEnregistré.projector.js';
import { producteurModifiéProjector } from './producteurModifié.projector.js';
import { producteurImportéProjector } from './producteurImporté.projector.js';

export type SubscriptionEvent = Lauréat.Producteur.ProducteurEvent | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.Producteur', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, producteurRebuildTriggeredProjector)
      .with({ type: 'ChangementProducteurEnregistré-V1' }, changementProducteurEnregistréProjector)
      .with({ type: 'ProducteurModifié-V1' }, producteurModifiéProjector)
      .with({ type: 'ProducteurImporté-V1' }, producteurImportéProjector)
      .exhaustive();

  mediator.register('System.Projector.Lauréat.Producteur', handler);
};
