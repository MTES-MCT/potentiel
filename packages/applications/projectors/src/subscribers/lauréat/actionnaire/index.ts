import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';

import { actionnaireImportéProjector } from './actionnaireImporté.projector.js';
import { actionnaireModifiéProjector } from './actionnaireModifié.projector.js';
import { actionnaireRebuildTriggered } from './actionnaireRebuildTriggered.projector.js';
import { changementActionnaireAccordéProjector } from './changementActionnaireAccordé.projector.js';
import { changementActionnaireAnnuléProjector } from './changementActionnaireAnnulé.projector.js';
import { changementActionnaireDemandéProjector } from './changementActionnaireDemandé.projector.js';
import { changementActionnaireRejetéProjector } from './changementActionnaireRejeté.projector.js';
import { changementActionnaireSuppriméProjector } from './changementActionnaireSupprimé.projector.js';
import { changementActionnaireEnregistréProjector } from './changementActionnaireEnregistré.projector.js';

export type SubscriptionEvent = Lauréat.Actionnaire.ActionnaireEvent | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.Actionnaire', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, actionnaireRebuildTriggered)
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
