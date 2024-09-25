import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Période } from '@potentiel-domain/periode';
import { getLogger } from '@potentiel-libraries/monitoring';
import { ListerUtilisateursQuery } from '@potentiel-domain/utilisateur';
import { Candidature } from '@potentiel-domain/candidature';

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

      const identifiantProjetToInclude = [
        ...event.payload.identifiantLauréats,
        ...event.payload.identifiantÉliminés,
      ];

      const candidatures = await mediator.send<Candidature.ListerCandidaturesQuery>({
        type: 'Candidature.Query.ListerCandidatures',
        data: {
          période: période.id,
          appelOffre: appelOffre.id,
          identifiantProjets: identifiantProjetToInclude,
        },
      });

      const uniquePorteursEmail = candidatures.items.reduce<
        { email: string; nomComplet: string }[]
      >((acc, candidature) => {
        const { emailContact: email, nomReprésentantLégal: nomComplet } = candidature;

        if (!acc.some((porteur) => porteur.email === email)) {
          acc.push({ email, nomComplet });
        }

        return acc;
      }, []);

      const { BASE_URL } = process.env;

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
        ...uniquePorteursEmail.map(({ email, nomComplet }) => ({
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
