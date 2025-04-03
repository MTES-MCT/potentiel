import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Puissance } from '@potentiel-domain/laureat';

import { puissanceImportéeProjector } from './puissanceImportée.projector';
import { puissanceRebuilTriggeredProjector } from './puissanceRebuildTrigerred.projector';
import { puissanceModifiéeProjector } from './puissanceModifiée.projector';
import { changementPuissanceDemandéProjector } from './changementPuissanceDemandé.projector';
import { changementPuissanceAnnuléProjector } from './changementPuissanceAnnulé.projector';
import { changementPuissanceSuppriméProjector } from './changementPuissanceSupprimé.projector';

export type SubscriptionEvent = (Puissance.PuissanceEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.Puissance', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, puissanceRebuilTriggeredProjector)
      .with({ type: 'PuissanceImportée-V1' }, puissanceImportéeProjector)
      .with({ type: 'PuissanceModifiée-V1' }, puissanceModifiéeProjector)
      .with({ type: 'ChangementPuissanceDemandé-V1' }, changementPuissanceDemandéProjector)
      .with({ type: 'ChangementPuissanceAnnulé-V1' }, changementPuissanceAnnuléProjector)
      .with({ type: 'ChangementPuissanceSupprimé-V1' }, changementPuissanceSuppriméProjector)
      .exhaustive();

  mediator.register('System.Projector.Lauréat.Puissance', handler);
};
