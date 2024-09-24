import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Période } from '@potentiel-domain/periode';
import { getLogger } from '@potentiel-libraries/monitoring';
import { ListerUtilisateursQuery } from '@potentiel-domain/utilisateur';

import { EmailPayload, SendEmail } from '../../sendEmail';

export type SubscriptionEvent = Période.PériodeEvent & Event;

export type Execute = Message<'System.Notification.Période', SubscriptionEvent>;

const templateId = {
  notifierDrealAcheteurObligéAdemeCaisseDesDépôtsCRE: 3849728,
  notifierPorteur: 1350523,
};

async function getEmailPayloads(
  event: SubscriptionEvent,
): Promise<ReadonlyArray<EmailPayload> | undefined> {
  const identifiantPériode = Période.IdentifiantPériode.convertirEnValueType(
    event.payload.identifiantPériode,
  );

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
          new Error(
            `Pas d'appel d'offre trouvé pour l'identifiant période ${identifiantPériode.formatter()}`,
          ),
        );
        return;
      }

      const période = appelOffre.periodes.find((x) => x.id === identifiantPériode.période);

      if (!période) {
        getLogger().error(
          new Error(
            `Pas de période trouvée pour l'identifiant période ${identifiantPériode.formatter()}`,
          ),
        );
        return;
      }

      const usersOthersThanDGECOrPorteur = await mediator.send<ListerUtilisateursQuery>({
        type: 'Utilisateur.Query.ListerUtilisateurs',
        data: {
          roles: ['acheteur-obligé', 'ademe', 'caisse-des-dépôts', 'cre', 'dreal'],
        },
      });

      const porteurs = await mediator.send<ListerUtilisateursQuery>({
        type: 'Utilisateur.Query.ListerUtilisateurs',
        data: {
          roles: ['porteur-projet'],
        },
      });

      const { BASE_URL } = process.env;

      console.log('violette');
      console.log(porteurs);
      console.log(usersOthersThanDGECOrPorteur);

      return [
        ...usersOthersThanDGECOrPorteur.items.map(({ email, nomComplet }) => ({
          templateId: templateId.notifierDrealAcheteurObligéAdemeCaisseDesDépôtsCRE,
          recipients: [
            {
              email,
              fullName: nomComplet,
            },
          ],
          messageSubject: `Potentiel - Notification de la période ${période.id} de l'appel d'offres ${appelOffre.id}`,
          variables: {
            appel_offre: appelOffre.id,
            periode: période.id,
            date_notification: new Date(event.payload.notifiéeLe).toLocaleDateString(),
            modification_request_url: `${BASE_URL}/projets.html`,
          },
        })),
        ...porteurs.items.map(({ email, nomComplet }) => ({
          templateId: templateId.notifierPorteur,
          recipients: [
            {
              email,
              fullName: nomComplet,
            },
          ],
          messageSubject: `Potentiel - Notification de la période ${période.id} de l'appel d'offres ${appelOffre.id}`,
          variables: {
            invitation_link: `${BASE_URL}/projets.html`,
          },
        })),
      ];
  }
}

type RegisterPériodeNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterPériodeNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const payloads = await getEmailPayloads(event);
    if (payloads) {
      await Promise.all(payloads.map(sendEmail));
    }
  };

  mediator.register('System.Notification.Période', handler);
};
