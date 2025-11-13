import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';

import { rebuildTriggeredProjector } from './rebuildTriggered.projector';
import { représentantLégalImportéProjector } from './représentantLégalImporté.projector';
import { représentantLégalModifiéProjector } from './représentantLégalModifié.projector';
import { changementReprésentantLégalDemandéProjector } from './changement/changementReprésentantLégalDemandé.projector';
import { changementReprésentantLégalAccordéProjector } from './changement/changementReprésentantLégalAccordé.projector';
import { changementReprésentantLégalRejetéProjector } from './changement/changementReprésentantLégalRejeté.projector';
import { changementReprésentantLégalSuppriméProjector } from './changement/changementReprésentantLégalSupprimé.projector';
import { changementReprésentantLégalAnnuléProjector } from './changement/changementReprésentantLégalAnnulé.projector';
import { changementReprésentantLégalCorrigéProjector } from './changement/changementReprésentantLégalCorrigé.projector';
import { changementReprésentantLégalEnregistréProjector } from './changement/changementReprésentantLégalEnregistré.projector';

export type SubscriptionEvent = Lauréat.ReprésentantLégal.ReprésentantLégalEvent | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.ReprésentantLégal', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, rebuildTriggeredProjector)
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
