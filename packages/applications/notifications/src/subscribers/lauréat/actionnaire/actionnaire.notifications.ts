import { Message, MessageHandler, mediator } from 'mediateur';
import { match, P } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { SendEmail } from '#sendEmail';

import {
  handleActionnaireModifié,
  handleChangementActionnaireAccordé,
  handleChangementActionnaireAnnulé,
  handleChangementActionnaireDemandé,
  handleChangementActionnaireEnregistré,
  handleChangementActionnaireRejeté,
} from './handlers/index.js';

export type SubscriptionEvent = Lauréat.Actionnaire.ActionnaireEvent;

export type Execute = Message<'System.Notification.Lauréat.Actionnaire', SubscriptionEvent>;

export type RegisterActionnaireNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with({ type: 'ActionnaireModifié-V1' }, handleActionnaireModifié)
      .with({ type: 'ChangementActionnaireDemandé-V1' }, handleChangementActionnaireDemandé)
      .with({ type: 'ChangementActionnaireAccordé-V1' }, handleChangementActionnaireAccordé)
      .with({ type: 'ChangementActionnaireRejeté-V1' }, handleChangementActionnaireRejeté)
      .with({ type: 'ChangementActionnaireAnnulé-V1' }, handleChangementActionnaireAnnulé)
      .with({ type: 'ChangementActionnaireEnregistré-V1' }, handleChangementActionnaireEnregistré)
      .with({ type: P.union('ActionnaireImporté-V1', 'ChangementActionnaireSupprimé-V1') }, () =>
        Promise.resolve(),
      )
      .exhaustive();

  mediator.register('System.Notification.Lauréat.Actionnaire', handler);
};
