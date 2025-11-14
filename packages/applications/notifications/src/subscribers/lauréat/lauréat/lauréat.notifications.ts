import { mediator, Message, MessageHandler } from 'mediateur';
import { match, P } from 'ts-pattern';
import { getLauréat, getBaseUrl } from '@/helpers';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { SendEmail } from '@/sendEmail';

import { handleCahierDesChargesChoisi } from './handlers/cahierDesChargesChoisi.handler';
import { handleChangementNomProjetEnregistré } from './handlers/changementNomProjetEnregistré.handler';

export type SubscriptionEvent = Lauréat.LauréatEvent;

export type Execute = Message<'System.Notification.Lauréat', SubscriptionEvent>;

export type RegisterLauréatNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterLauréatNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      event.payload.identifiantProjet,
    );
    const projet = await getLauréat(identifiantProjet.formatter());
    const baseUrl = getBaseUrl();

    return await match(event)
      .with({ type: 'CahierDesChargesChoisi-V1' }, (event) =>
        handleCahierDesChargesChoisi({ event, sendEmail }),
      )
      .with({ type: 'ChangementNomProjetEnregistré-V1' }, (event) =>
        handleChangementNomProjetEnregistré({ sendEmail, event, projet, baseUrl }),
      )
      .with(
        {
          type: P.union(
            'LauréatNotifié-V1',
            'LauréatNotifié-V2',
            'NomEtLocalitéLauréatImportés-V1',
            'NomProjetModifié-V1',
            'SiteDeProductionModifié-V1',
          ),
        },
        () => Promise.resolve(),
      )
      .exhaustive();
  };

  mediator.register('System.Notification.Lauréat', handler);
};
