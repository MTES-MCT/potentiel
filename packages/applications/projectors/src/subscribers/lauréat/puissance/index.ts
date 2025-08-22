import { type Message, type MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';
import type { Event, RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { changementPuissanceAccordéProjector } from './changementPuissanceAccordé.projector';
import { changementPuissanceAnnuléProjector } from './changementPuissanceAnnulé.projector';
import { changementPuissanceDemandéProjector } from './changementPuissanceDemandé.projector';
import { changementPuissanceEnregistréProjector } from './changementPuissanceEnregistré.projector';
import { changementPuissanceRejetéProjector } from './changementPuissanceRejeté.projector';
import { changementPuissanceSuppriméProjector } from './changementPuissanceSupprimé.projector';
import { puissanceImportéeProjector } from './puissanceImportée.projector';
import { puissanceModifiéeProjector } from './puissanceModifiée.projector';
import { puissanceRebuilTriggeredProjector } from './puissanceRebuildTrigerred.projector';

export type SubscriptionEvent = (Lauréat.Puissance.PuissanceEvent & Event) | RebuildTriggered;

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
      .with({ type: 'ChangementPuissanceEnregistré-V1' }, changementPuissanceEnregistréProjector)
      .with({ type: 'ChangementPuissanceAccordé-V1' }, changementPuissanceAccordéProjector)
      .with({ type: 'ChangementPuissanceRejeté-V1' }, changementPuissanceRejetéProjector)
      .exhaustive();

  mediator.register('System.Projector.Lauréat.Puissance', handler);
};
