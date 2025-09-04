import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Event, RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';

import { producteurRebuilTriggeredProjector } from './producteurRebuildTrigerred.projector';
import { changementInstallateurEnregistréProjector } from './changementInstallateurEnregistré.projector';
import { producteurModifiéProjector } from './producteurModifié.projector';
import { producteurImportéProjector } from './producteurImporté.projector';

export type SubscriptionEvent = (Lauréat.Installateur.InstallateurEvent | RebuildTriggered) & Event;

export type Execute = Message<'System.Projector.Lauréat.Installateur', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, producteurRebuilTriggeredProjector)
      .with(
        { type: 'ChangementInstallateurEnregistré-V1' },
        changementInstallateurEnregistréProjector,
      )
      .with({ type: 'InstallateurModifié-V1' }, producteurModifiéProjector)
      .with({ type: 'InstallateurImporté-V1' }, producteurImportéProjector)
      .exhaustive();

  mediator.register('System.Projector.Lauréat.Installateur', handler);
};
