import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Lauréat } from '@potentiel-domain/laureat';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Candidature } from '@potentiel-domain/candidature';

import { EmailPayload, SendEmail } from '../../sendEmail';

export type SubscriptionEvent = Lauréat.LauréatEvent & Event;

export type Execute = Message<'System.Notification.Lauréat', SubscriptionEvent>;

const templateId = {
  notifierPorteur: 1350523,
};

async function getEmailPayload({
  type,
  payload,
}: SubscriptionEvent): Promise<EmailPayload | undefined> {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(payload.identifiantProjet);

  const { BASE_URL } = process.env;

  switch (type) {
    case 'LauréatNotifié-V1':
      const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
        type: 'AppelOffre.Query.ConsulterAppelOffre',
        data: {
          identifiantAppelOffre: identifiantProjet.appelOffre,
        },
      });
      if (Option.isNone(appelOffre)) {
        getLogger().error(
          new Error(`Pas d'appel d'offre trouvé pour ${identifiantProjet.formatter()}`),
        );
        return;
      }
      const période = appelOffre.periodes.find((x) => x.id === identifiantProjet.période);

      if (!période) {
        getLogger().error(
          new Error(`Pas de période trouvée pour ${identifiantProjet.formatter()}`),
        );
        return;
      }

      const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
        type: 'Candidature.Query.ConsulterCandidature',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });
      if (Option.isNone(candidature)) {
        getLogger().error(
          new Error(`Pas de candidature trouvée pour ${identifiantProjet.formatter()}`),
        );
        return;
      }

      return {
        templateId: templateId.notifierPorteur,
        recipients: [
          {
            email: candidature.emailContact,
            fullName: candidature.nomReprésentantLégal,
          },
        ],
        copyRecipients: [],
        hiddenCopyRecipients: [],
        messageSubject: `Résultats de la ${période.title} période de l'appel d'offres ${appelOffre.id}`,
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
