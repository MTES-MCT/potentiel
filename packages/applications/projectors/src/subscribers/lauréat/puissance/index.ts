import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';

import { puissanceImportéeProjector } from './puissanceImportée.projector.js';
import { puissanceRebuildTriggeredProjector } from './puissanceRebuildTrigerred.projector.js';
import { puissanceModifiéeProjector } from './puissanceModifiée.projector.js';
import { changementPuissanceDemandéProjector } from './changementPuissanceDemandé.projector.js';
import { changementPuissanceAnnuléProjector } from './changementPuissanceAnnulé.projector.js';
import { changementPuissanceSuppriméProjector } from './changementPuissanceSupprimé.projector.js';
import { changementPuissanceAccordéProjector } from './changementPuissanceAccordé.projector.js';
import { changementPuissanceEnregistréProjector } from './changementPuissanceEnregistré.projector.js';
import { changementPuissanceRejetéProjector } from './changementPuissanceRejeté.projector.js';

export type SubscriptionEvent = Lauréat.Puissance.PuissanceEvent | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.Puissance', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, puissanceRebuildTriggeredProjector)
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
