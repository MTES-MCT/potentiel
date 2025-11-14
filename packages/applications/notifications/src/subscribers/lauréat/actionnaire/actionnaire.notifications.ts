import { Message, MessageHandler, mediator } from 'mediateur';
import { match, P } from 'ts-pattern';
import { getBaseUrl, getLauréat } from '@/helpers';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { SendEmail } from '@/sendEmail';

import {
  handleActionnaireModifié,
  handleChangementActionnaireAccordé,
  handleChangementActionnaireAnnulé,
  handleChangementActionnaireDemandé,
  handleChangementActionnaireEnregistré,
  handleChangementActionnaireRejeté,
} from "./handlers.js";

export type SubscriptionEvent = Lauréat.Actionnaire.ActionnaireEvent;

export type Execute = Message<'System.Notification.Lauréat.Actionnaire', SubscriptionEvent>;

export type RegisterActionnaireNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterActionnaireNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      event.payload.identifiantProjet,
    );
    const projet = await getLauréat(identifiantProjet.formatter());

    return match(event)
      .with({ type: 'ActionnaireModifié-V1' }, async (event) =>
        handleActionnaireModifié({
          sendEmail,
          event,
          projet,
        }),
      )
      .with({ type: 'ChangementActionnaireDemandé-V1' }, async (event) =>
        handleChangementActionnaireDemandé({
          sendEmail,
          event,
          projet,
          baseUrl: getBaseUrl(),
        }),
      )
      .with({ type: 'ChangementActionnaireAccordé-V1' }, async (event) =>
        handleChangementActionnaireAccordé({ sendEmail, event, projet }),
      )
      .with({ type: 'ChangementActionnaireRejeté-V1' }, async (event) =>
        handleChangementActionnaireRejeté({ sendEmail, event, projet }),
      )
      .with({ type: 'ChangementActionnaireAnnulé-V1' }, async (event) =>
        handleChangementActionnaireAnnulé({ sendEmail, event, projet }),
      )
      .with({ type: 'ChangementActionnaireEnregistré-V1' }, async (event) =>
        handleChangementActionnaireEnregistré({ sendEmail, event, projet }),
      )
      .with({ type: P.union('ActionnaireImporté-V1', 'ChangementActionnaireSupprimé-V1') }, () =>
        Promise.resolve(),
      )
      .exhaustive();
  };

  mediator.register('System.Notification.Lauréat.Actionnaire', handler);
};
