import { type Message, type MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';
import type { Event, RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { actionnaireImportéProjector } from './actionnaireImporté.projector';
import { actionnaireModifiéProjector } from './actionnaireModifié.projector';
import { actionnaireRebuilTriggered } from './actionnaireRebuildTriggered.projector';
import { changementActionnaireAccordéProjector } from './changementActionnaireAccordé.projector';
import { changementActionnaireAnnuléProjector } from './changementActionnaireAnnulé.projector';
import { changementActionnaireDemandéProjector } from './changementActionnaireDemandé.projector';
import { changementActionnaireEnregistréProjector } from './changementActionnaireEnregistré.projector';
import { changementActionnaireRejetéProjector } from './changementActionnaireRejeté.projector';
import { changementActionnaireSuppriméProjector } from './changementActionnaireSupprimé.projector';

export type SubscriptionEvent = (Lauréat.Actionnaire.ActionnaireEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.Actionnaire', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, actionnaireRebuilTriggered)
      .with({ type: 'ActionnaireImporté-V1' }, actionnaireImportéProjector)
      .with({ type: 'ActionnaireModifié-V1' }, actionnaireModifiéProjector)
      .with({ type: 'ChangementActionnaireDemandé-V1' }, changementActionnaireDemandéProjector)
      .with({ type: 'ChangementActionnaireAnnulé-V1' }, changementActionnaireAnnuléProjector)
      .with({ type: 'ChangementActionnaireAccordé-V1' }, changementActionnaireAccordéProjector)
      .with({ type: 'ChangementActionnaireRejeté-V1' }, changementActionnaireRejetéProjector)
      .with({ type: 'ChangementActionnaireSupprimé-V1' }, changementActionnaireSuppriméProjector)
      .with(
        { type: 'ChangementActionnaireEnregistré-V1' },
        changementActionnaireEnregistréProjector,
      )
      .exhaustive();

  mediator.register('System.Projector.Lauréat.Actionnaire', handler);
};
