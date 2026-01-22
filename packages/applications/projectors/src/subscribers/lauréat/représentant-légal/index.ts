import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';

import { représentantLégalRebuildTriggeredProjector } from './représentantLégalRebuildTriggered.projector.js';
import { représentantLégalImportéProjector } from './représentantLégalImporté.projector.js';
import { représentantLégalModifiéProjector } from './représentantLégalModifié.projector.js';
import { changementReprésentantLégalDemandéProjector } from './changement/changementReprésentantLégalDemandé.projector.js';
import { changementReprésentantLégalAccordéProjector } from './changement/changementReprésentantLégalAccordé.projector.js';
import { changementReprésentantLégalRejetéProjector } from './changement/changementReprésentantLégalRejeté.projector.js';
import { changementReprésentantLégalSuppriméProjector } from './changement/changementReprésentantLégalSupprimé.projector.js';
import { changementReprésentantLégalAnnuléProjector } from './changement/changementReprésentantLégalAnnulé.projector.js';
import { changementReprésentantLégalCorrigéProjector } from './changement/changementReprésentantLégalCorrigé.projector.js';
import { changementReprésentantLégalEnregistréProjector } from './changement/changementReprésentantLégalEnregistré.projector.js';

export type SubscriptionEvent = Lauréat.ReprésentantLégal.ReprésentantLégalEvent | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.ReprésentantLégal', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, représentantLégalRebuildTriggeredProjector)
      .with({ type: 'ReprésentantLégalImporté-V1' }, représentantLégalImportéProjector)
      .with({ type: 'ReprésentantLégalModifié-V1' }, représentantLégalModifiéProjector)
      .with(
        { type: 'ChangementReprésentantLégalDemandé-V1' },
        changementReprésentantLégalDemandéProjector,
      )
      .with(
        {
          type: 'ChangementReprésentantLégalAnnulé-V1',
        },
        changementReprésentantLégalAnnuléProjector,
      )
      .with(
        { type: 'ChangementReprésentantLégalCorrigé-V1' },
        changementReprésentantLégalCorrigéProjector,
      )
      .with(
        { type: 'ChangementReprésentantLégalAccordé-V1' },
        changementReprésentantLégalAccordéProjector,
      )
      .with(
        { type: 'ChangementReprésentantLégalRejeté-V1' },
        changementReprésentantLégalRejetéProjector,
      )
      .with(
        {
          type: 'ChangementReprésentantLégalSupprimé-V1',
        },
        changementReprésentantLégalSuppriméProjector,
      )
      .with(
        {
          type: 'ChangementReprésentantLégalEnregistré-V1',
        },
        changementReprésentantLégalEnregistréProjector,
      )
      .exhaustive();

  mediator.register('System.Projector.Lauréat.ReprésentantLégal', handler);
};
