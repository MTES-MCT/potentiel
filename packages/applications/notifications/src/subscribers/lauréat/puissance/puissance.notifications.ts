import { Message, MessageHandler, mediator } from 'mediateur';
import { match, P } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { SendEmail } from '#sendEmail';

import {
  handleChangementPuissanceAccordé,
  handleChangementPuissanceDemandé,
  handleChangementPuissanceAnnulé,
  handleChangementPuissanceEnregistré,
  handleChangementPuissanceRejeté,
  handlePuissanceModifié,
} from './handlers/index.js';

export type SubscriptionEvent = Lauréat.Puissance.PuissanceEvent;

export type Execute = Message<'System.Notification.Lauréat.Puissance', SubscriptionEvent>;

export type RegisterPuissanceNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with({ type: 'PuissanceModifiée-V1' }, handlePuissanceModifié)
      .with({ type: 'ChangementPuissanceDemandé-V1' }, handleChangementPuissanceDemandé)
      .with({ type: 'ChangementPuissanceAccordé-V1' }, handleChangementPuissanceAccordé)
      .with({ type: 'ChangementPuissanceRejeté-V1' }, handleChangementPuissanceRejeté)
      .with({ type: 'ChangementPuissanceAnnulé-V1' }, handleChangementPuissanceAnnulé)
      .with({ type: 'ChangementPuissanceEnregistré-V1' }, handleChangementPuissanceEnregistré)
      .with({ type: P.union('PuissanceImportée-V1', 'ChangementPuissanceSupprimé-V1') }, () =>
        Promise.resolve(),
      )
      .exhaustive();

  mediator.register('System.Notification.Lauréat.Puissance', handler);
};
