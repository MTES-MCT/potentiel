import { Message, MessageHandler, mediator } from 'mediateur';
import { match, P } from 'ts-pattern';
import { getLauréat } from '@helpers';
import { getBaseUrl } from '@helpers';

import { Lauréat } from '@potentiel-domain/projet';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { SendEmail } from '@/sendEmail';

import {
  handleChangementPuissanceAccordé,
  handleChangementPuissanceAnnulé,
  handleChangementPuissanceDemandé,
  handleChangementPuissanceEnregistré,
  handleChangementPuissanceRejeté,
  handlePuissanceModifiée,
} from './handlers';

export type SubscriptionEvent = Lauréat.Puissance.PuissanceEvent;

export type Execute = Message<'System.Notification.Lauréat.Puissance', SubscriptionEvent>;

export type RegisterPuissanceNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterPuissanceNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      event.payload.identifiantProjet,
    );
    const projet = await getLauréat(identifiantProjet.formatter());

    const baseUrl = getBaseUrl();

    return match(event)
      .with({ type: 'PuissanceModifiée-V1' }, async (event) =>
        handlePuissanceModifiée({
          sendEmail,
          event,
          projet,
        }),
      )
      .with({ type: 'ChangementPuissanceEnregistré-V1' }, async (event) =>
        handleChangementPuissanceEnregistré({
          sendEmail,
          event,
          projet,
        }),
      )
      .with({ type: 'ChangementPuissanceDemandé-V1' }, async (event) =>
        handleChangementPuissanceDemandé({
          sendEmail,
          event,
          projet,
          baseUrl,
        }),
      )
      .with({ type: 'ChangementPuissanceAnnulé-V1' }, async (event) =>
        handleChangementPuissanceAnnulé({
          sendEmail,
          event,
          projet,
        }),
      )
      .with({ type: 'ChangementPuissanceAccordé-V1' }, async (event) =>
        handleChangementPuissanceAccordé({
          sendEmail,
          event,
          projet,
        }),
      )
      .with({ type: 'ChangementPuissanceRejeté-V1' }, async (event) =>
        handleChangementPuissanceRejeté({
          sendEmail,
          event,
          projet,
        }),
      )
      .with(
        {
          type: P.union('ChangementPuissanceSupprimé-V1', 'PuissanceImportée-V1'),
        },
        () => Promise.resolve(),
      )
      .exhaustive();
  };

  mediator.register('System.Notification.Lauréat.Puissance', handler);
};
