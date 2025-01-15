import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { handleRebuilTriggered } from './handleRebuildTriggered';
import { handleReprésentantLégalImporté } from './handleReprésentantLégalImporté';
import { handleReprésentantLégalModifié } from './handleReprésentantLégalModifié';
import { handleChangementReprésentantLégalDemandé } from './handleChangementReprésentantLégalDemandé';
import { handleChangementReprésentantLégalAccordé } from './handleChangementReprésentantLégalAccordé';
import { handleChangementReprésentantLégalRejeté } from './handleChangementReprésentantLégalRejeté';
import { handleChangementReprésentantLégalSupprimé } from './handleChangementReprésentantLégalSupprimé';
import { handleChangementReprésentantLégalAnnulé } from './handleChangementReprésentantLégalAnnulé';

export type SubscriptionEvent =
  | (ReprésentantLégal.ReprésentantLégalEvent & Event)
  | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.ReprésentantLégal', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, handleRebuilTriggered)
      .with({ type: 'ReprésentantLégalImporté-V1' }, handleReprésentantLégalImporté)
      .with({ type: 'ReprésentantLégalModifié-V1' }, handleReprésentantLégalModifié)
      .with(
        { type: 'ChangementReprésentantLégalDemandé-V1' },
        handleChangementReprésentantLégalDemandé,
      )
      .with(
        {
          type: 'ChangementReprésentantLégalAnnulé-V1',
        },
        handleChangementReprésentantLégalAnnulé,
      )
      .with(
        { type: 'ChangementReprésentantLégalAccordé-V1' },
        handleChangementReprésentantLégalAccordé,
      )
      .with(
        { type: 'ChangementReprésentantLégalRejeté-V1' },
        handleChangementReprésentantLégalRejeté,
      )
      .with(
        {
          type: 'ChangementReprésentantLégalSupprimé-V1',
        },
        handleChangementReprésentantLégalSupprimé,
      )
      .exhaustive();

  mediator.register('System.Projector.Lauréat.ReprésentantLégal', handler);
};
