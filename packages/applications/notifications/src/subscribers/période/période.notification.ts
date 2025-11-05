import { Message, MessageHandler, mediator } from 'mediateur';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Période } from '@potentiel-domain/periode';
import { Candidature } from '@potentiel-domain/projet';
import { ListerUtilisateursQuery } from '@potentiel-domain/utilisateur';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Routes } from '@potentiel-applications/routes';

import { getBaseUrl } from '../../helpers';
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
          roles: ['cocontractant', 'acheteur-obligé', 'ademe', 'caisse-des-dépôts', 'cre', 'dreal'],
          actif: true,
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

      const porteurs = [
        ...new Set(candidatures.items.map((candidature) => candidature.emailContact.formatter())),
      ];
      const baseUrl = getBaseUrl();

      return [
        ...usersOthersThanDGECOrPorteur.items.map(({ email }) => ({
          templateId: templateId.notifierDrealAcheteurObligéAdemeCaisseDesDépôtsCRE,
          recipients: [
            {
              email,
            },
          ],
          messageSubject: `Potentiel - Notification de la période ${période.id} de l'appel d'offres ${appelOffre.id}`,
          variables: {
            appel_offre: appelOffre.id,
            periode: période.id,
            date_notification: new Date(event.payload.notifiéeLe).toLocaleDateString('fr-FR'),
            redirect_url: baseUrl,
          },
        })),
        ...porteurs.map((email) => {
          const projets = candidatures.items.filter(
            (candidature) => candidature.emailContact.formatter() === email,
          );

          return {
            templateId: templateId.notifierPorteur,
            recipients: [
              {
                email,
                fullName: projets[0].nomReprésentantLégal,
              },
            ],
            messageSubject: `Résultats de la ${période.title} période de l'appel d'offres ${appelOffre.id}`,
            variables: {
              redirect_url:
                projets?.length === 1
                  ? `${baseUrl}${Routes.Projet.details(projets[0].identifiantProjet.formatter())}`
                  : baseUrl,
            },
          };
        }),
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
