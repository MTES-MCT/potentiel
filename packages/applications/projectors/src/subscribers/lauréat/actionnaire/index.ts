import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Actionnaire } from '@potentiel-domain/laureat';

import { handleDemandeChangementActionnaireAccordée } from './handleDemandeChangementActionnaireAccordée';
import { handleRebuilTriggered } from './handleRebuildTriggered';
import { handleChangementActionnaireDemandé } from './handleChangementActionnaireDemandé';
import { handleDemandeChangementActionnaireAnnulée } from './handleDemandeChangementActionnaireAnnulée';
import { handleActionnaireImporté } from './handleActionnaireImporté';
import { handleActionnaireModifié } from './handleActionnaireModifié';
import { handleDemandeChangementActionnaireRejetée } from './handleDemandeChangementActionnaireRejetée';
import { handleActionnaireTransmis } from './handleActionnaireTransmis';
import { handleDemandeChangementActionnaireSupprimée } from './handleDemandeChangementActionnaireSupprimée';

export type SubscriptionEvent = (Actionnaire.ActionnaireEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.Actionnaire', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, handleRebuilTriggered)
      .with({ type: 'ActionnaireImporté-V1' }, handleActionnaireImporté)
      .with({ type: 'ActionnaireModifié-V1' }, handleActionnaireModifié)
      .with({ type: 'ActionnaireTransmis-V1' }, handleActionnaireTransmis)
      .with({ type: 'ChangementActionnaireDemandé-V1' }, handleChangementActionnaireDemandé)
      .with(
        { type: 'DemandeChangementActionnaireAnnulée-V1' },
        handleDemandeChangementActionnaireAnnulée,
      )
      .with(
        { type: 'DemandeChangementActionnaireAccordée-V1' },
        handleDemandeChangementActionnaireAccordée,
      )
      .with(
        { type: 'DemandeChangementActionnaireRejetée-V1' },
        handleDemandeChangementActionnaireRejetée,
      )
      .with(
        { type: 'DemandeChangementActionnaireSupprimée-V1' },
        handleDemandeChangementActionnaireSupprimée,
      )
      .exhaustive();

  mediator.register('System.Projector.Lauréat.Actionnaire', handler);
};
