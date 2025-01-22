import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Actionnaire } from '@potentiel-domain/laureat';

import { actionnaireImportéProjector } from './actionnaireImporté.projector';
import { actionnaireModifiéProjector } from './actionnaireModifié.projector';
import { actionnaireRebuilTriggered } from './actionnaireRebuildTriggered.projector';
import { changementActionnaireAccordéProjector } from './changementActionnaireAccordé.projector';
import { changementActionnaireAnnuléProjector } from './changementActionnaireAnnulé.projector';
import { changementActionnaireDemandéProjector } from './changementActionnaireDemandé.projector';
import { changementActionnaireRejetéProjector } from './changementActionnaireRejeté.projector';
import { changementActionnaireSuppriméProjector } from './changementActionnaireSupprimé.projector';

export type SubscriptionEvent = (Actionnaire.ActionnaireEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.Actionnaire', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, actionnaireRebuilTriggered)
      .with({ type: 'ActionnaireImporté-V1' }, actionnaireImportéProjector)
      .with({ type: 'ActionnaireModifié-V1' }, actionnaireModifiéProjector)
      .with({ type: 'ChangementActionnaireDemandé-V1' }, changementActionnaireDemandéProjector)
      .with({ type: 'ChangementActionnaireAnnulé-V1' }, changementActionnaireAnnuléProjector)
      .with({ type: 'ChangementActionnaireAccordé-V1' }, changementActionnaireAccordéProjector)
      .with({ type: 'ChangementActionnaireRejeté-V1' }, changementActionnaireRejetéProjector)
      .with({ type: 'ChangementActionnaireSupprimé-V1' }, changementActionnaireSuppriméProjector)
      .exhaustive();

  mediator.register('System.Projector.Lauréat.Actionnaire', handler);
};
