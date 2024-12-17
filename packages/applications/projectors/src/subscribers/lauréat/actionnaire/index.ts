import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Actionnaire } from '@potentiel-domain/laureat';

import { handleRebuilTriggered } from './handleRebuildTriggered';
import { handleChangementActionnaireDemandé } from './handleChangementActionnaireDemandé';
import { handleDemandeChangementActionnaireAnnulée } from './handleDemandeChangementActionnaireAnnulée';
import { handleActionnaireImporté } from './handleActionnaireImporté';
import { handleActionnaireModifié } from './handleActionnaireModifié';

export type SubscriptionEvent = (Actionnaire.ActionnaireEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.Actionnaire', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, handleRebuilTriggered)
      .with({ type: 'ActionnaireImporté-V1' }, handleActionnaireImporté)
      .with({ type: 'ActionnaireModifié-V1' }, handleActionnaireModifié)
      .with({ type: 'ChangementActionnaireDemandé-V1' }, handleChangementActionnaireDemandé)
      .with(
        { type: 'DemandeChangementActionnaireAnnulée-V1' },
        handleDemandeChangementActionnaireAnnulée,
      )
      .exhaustive();

  mediator.register('System.Projector.Lauréat.Actionnaire', handler);
};
