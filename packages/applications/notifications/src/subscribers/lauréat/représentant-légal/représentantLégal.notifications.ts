import { Message, MessageHandler, mediator } from 'mediateur';
import { match, P } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { SendEmail } from '#sendEmail';

import {
  handleChangementReprésentantLégalAccordé,
  handleChangementReprésentantLégalDemandé,
  handleChangementReprésentantLégalAnnulé,
  handleChangementReprésentantLégalEnregistré,
  handleChangementReprésentantLégalRejeté,
  handleReprésentantLégalModifié,
  handleChangementReprésentantLégalCorrigé,
} from './handlers/index.js';

export type SubscriptionEvent = Lauréat.ReprésentantLégal.ReprésentantLégalEvent;

export type Execute = Message<'System.Notification.Lauréat.ReprésentantLégal', SubscriptionEvent>;

export type RegisterReprésentantLégalNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with({ type: 'ReprésentantLégalModifié-V1' }, handleReprésentantLégalModifié)
      .with(
        { type: 'ChangementReprésentantLégalDemandé-V1' },
        handleChangementReprésentantLégalDemandé,
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
        { type: 'ChangementReprésentantLégalAnnulé-V1' },
        handleChangementReprésentantLégalAnnulé,
      )
      .with(
        { type: 'ChangementReprésentantLégalEnregistré-V1' },
        handleChangementReprésentantLégalEnregistré,
      )
      .with(
        { type: 'ChangementReprésentantLégalCorrigé-V1' },
        handleChangementReprésentantLégalCorrigé,
      )
      .with(
        { type: P.union('ReprésentantLégalImporté-V1', 'ChangementReprésentantLégalSupprimé-V1') },
        () => Promise.resolve(),
      )
      .exhaustive();

  mediator.register('System.Notification.Lauréat.ReprésentantLégal', handler);
};
