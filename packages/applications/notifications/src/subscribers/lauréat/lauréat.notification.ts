import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Lauréat } from '@potentiel-domain/laureat';

import { EmailPayload, SendEmail } from '../../sendEmail';

export type SubscriptionEvent = Lauréat.LauréatEvent & Event;

export type Execute = Message<'System.Notification.Lauréat', SubscriptionEvent>;

const templateId = {
  notifierRolesSaufPorteurEtDgec: 3849728,
  notifierPorteur: 1350523,
};

async function getEmailPayload(event: SubscriptionEvent): Promise<EmailPayload | undefined> {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);

  const { BASE_URL } = process.env;

  switch (event.type) {
    case 'LauréatNotifié-V1':
      const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
        type: 'AppelOffre.Query.ConsulterAppelOffre',
        data: {
          identifiantAppelOffre: identifiantProjet.appelOffre,
        },
      });
      if (Option.isNone(appelOffre)) {
        // TODO error
        throw new Error('AO non trouvé');
      }
      const période = appelOffre.periodes.find((x) => x.id === identifiantProjet.période);

      if (Option.isNone(appelOffre)) {
        // TODO error
        throw new Error('Période non trouvée');
      }
      return {
        templateId: templateId.notifierPorteur,
        recipients: [{ email: 'porteur@test.test', fullName: 'foo' }], // TODO
        messageSubject: `Résultats de la ${période?.title} période de l'appel d'offres ${appelOffre.id}`,
        variables: {
          invitation_link: `${BASE_URL}/projets.html`,
        },
      };
  }
}

export type RegisterLauréatNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterLauréatNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const payload = await getEmailPayload(event);
    if (payload) {
      await sendEmail(payload);
    }
  };

  mediator.register('System.Notification.Lauréat', handler);
};
