import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Actionnaire } from '@potentiel-domain/laureat';

import { handleChangementActionnaireAccordé } from './handleChangementActionnaireAccordé';
import { handleRebuilTriggered } from './handleRebuildTriggered';
import { handleChangementActionnaireDemandé } from './handleChangementActionnaireDemandé';
import { handleChangementActionnaireAnnulé } from './handleChangementActionnaireAnnulé';
import { handleActionnaireImporté } from './handleActionnaireImporté';
import { handleActionnaireModifié } from './handleActionnaireModifié';
import { handleChangementActionnaireRejeté } from './handleChangementActionnaireRejeté';
import { handleChangementActionnaireSupprimé } from './handleChangementActionnaireSupprimé';

export type SubscriptionEvent = (Actionnaire.ActionnaireEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.Actionnaire', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, handleRebuilTriggered)
      .with({ type: 'ActionnaireImporté-V1' }, handleActionnaireImporté)
      .with({ type: 'ActionnaireModifié-V1' }, handleActionnaireModifié)
      .with({ type: 'ChangementActionnaireDemandé-V1' }, handleChangementActionnaireDemandé)
      .with({ type: 'ChangementActionnaireAnnulé-V1' }, handleChangementActionnaireAnnulé)
      .with({ type: 'ChangementActionnaireAccordé-V1' }, handleChangementActionnaireAccordé)
      .with({ type: 'ChangementActionnaireRejeté-V1' }, handleChangementActionnaireRejeté)
      .with({ type: 'ChangementActionnaireSupprimé-V1' }, handleChangementActionnaireSupprimé)
      .exhaustive();

  mediator.register('System.Projector.Lauréat.Actionnaire', handler);
};
