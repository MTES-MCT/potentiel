import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Période } from '@potentiel-domain/periode';
import { getLogger } from '@potentiel-libraries/monitoring';
import { ListerUtilisateurQuery } from '@potentiel-domain/utilisateur';

import { EmailPayload, SendEmail } from '../../sendEmail';

export type SubscriptionEvent = Période.PériodeEvent & Event;

export type Execute = Message<'System.Notification.Période', SubscriptionEvent>;

const templateId = {
  notifierDreals: ,
};

async function getEmailPayloads(
  event: SubscriptionEvent,
): Promise<ReadonlyArray<EmailPayload> | undefined> {
  const identifiantPériode = Période.IdentifiantPériode.convertirEnValueType(
    event.payload.identifiantPériode,
  );

  const { BASE_URL } = process.env;

  switch (event.type) {
    case 'PériodeNotifiée-V1':
      const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
        type: 'AppelOffre.Query.ConsulterAppelOffre',
        data: {
          identifiantAppelOffre: identifiantPériode.appelOffre,
        },
      });
      if (Option.isNone(appelOffre)) {
        getLogger().error(
          new Error(`Pas d'appel d'offre trouvé pour ${identifiantPériode.formatter()}`),
        );
        return;
      }
      const période = appelOffre.periodes.find((x) => x.id === identifiantPériode.période);

      if (!période) {
        getLogger().error(
          new Error(`Pas de période trouvée pour ${identifiantPériode.formatter()}`),
        );
        return;
      }

      const users = await mediator.send<ListerUtilisateurQuery>({
        type: 'Utilisateur.Query.ListerUtilisateur',
        data: { roles: ['acheteur-obligé', 'ademe', 'caisse-des-dépôts', 'cre', 'dreal'] },
      });

      return users.items.map(({ email, nomComplet }) => ({
        templateId: templateId.notifierDreals,
        recipients: [
          {
            email,
            fullName: nomComplet,
          },
        ],
        messageSubject: `Potentiel - Notification de la ${période.title} période de l'appel d'offres ${appelOffre.shortTitle}`,
        variables: {
          periode_link: `${BASE_URL}`,
        },
      }));
  }
}

export type RegisterÉliminéNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterÉliminéNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const payloads = await getEmailPayloads(event);
    if (payloads) {
      await Promise.all(payloads.map(sendEmail));
    }
  };

  mediator.register('System.Notification.Période', handler);
};
