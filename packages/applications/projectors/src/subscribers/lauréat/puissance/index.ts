import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';

import { puissanceImportéeProjector } from './puissanceImportée.projector';
import { puissanceRebuilTriggeredProjector } from './puissanceRebuildTrigerred.projector';
import { puissanceModifiéeProjector } from './puissanceModifiée.projector';
import { changementPuissanceDemandéProjector } from './changementPuissanceDemandé.projector';
import { changementPuissanceAnnuléProjector } from './changementPuissanceAnnulé.projector';
import { changementPuissanceSuppriméProjector } from './changementPuissanceSupprimé.projector';
import { changementPuissanceAccordéProjector } from './changementPuissanceAccordé.projector';
import { changementPuissanceEnregistréProjector } from './changementPuissanceEnregistré.projector';
import { changementPuissanceRejetéProjector } from './changementPuissanceRejeté.projector';

export type SubscriptionEvent = Lauréat.Puissance.PuissanceEvent | RebuildTriggered;

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
