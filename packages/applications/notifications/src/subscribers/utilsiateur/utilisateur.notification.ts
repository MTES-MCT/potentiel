import { Message, MessageHandler, mediator } from 'mediateur';
import { match, P } from 'ts-pattern';

import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import { UtilisateurEvent } from '@potentiel-domain/utilisateur';
import { Candidature } from '@potentiel-domain/candidature';
import { Lauréat } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';

import { EmailPayload, SendEmail } from '../../sendEmail';

export type SubscriptionEvent = UtilisateurEvent & Event;

export type Execute = Message<'System.Notification.Utilisateur', SubscriptionEvent>;

const templateIds = {
  porteurInvité: 1402576,
  accèsProjetRetiré: 4177049,
  utilisateurInvité: {
    dreal: 1436254,
    partenaires: 2814281,
  },
};

export type RegisterUtilisateurNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterUtilisateurNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { BASE_URL } = process.env;
    const urlPageProjets = `${BASE_URL}${Routes.Projet.lister()}`;
    const emailPayloads = await match(event)
      .returnType<Promise<EmailPayload[]>>()
      .with(
        { type: 'PorteurInvité-V1' },
        async ({ payload: { identifiantsProjet, identifiantUtilisateur, invitéPar } }) => {
          const nomsProjet = await Promise.all(identifiantsProjet.map(récupérerNomProjet));

          // On ne notifie pas le porteur invité par le système,
          // car cela correspond à l'invitation liée à la candidature,
          // pour laquelle le porteur est déjà notifié
          if (Email.convertirEnValueType(invitéPar).estÉgaleÀ(Email.system())) {
            return [];
          }

          return [
            {
              templateId: templateIds.porteurInvité,
              messageSubject: `Invitation à suivre les projets sur Potentiel`,
              recipients: [{ email: identifiantUtilisateur }],
              variables: {
                nomProjet: nomsProjet.filter(Boolean).join(', '),
                invitation_link: urlPageProjets,
              },
            },
          ];
        },
      )
      .with(
        { type: 'AccèsProjetRetiré-V1' },
        async ({ payload: { identifiantProjet, identifiantUtilisateur, cause } }) => {
          const nomProjet = await récupérerNomProjet(identifiantProjet);

          return [
            {
              templateId: templateIds.accèsProjetRetiré,
              messageSubject: `Révocation de vos accès pour le projet ${nomProjet}`,
              recipients: [{ email: identifiantUtilisateur }],
              variables: {
                nom_projet: nomProjet,
                mes_projets_url: urlPageProjets,
                cause:
                  cause === 'changement-producteur'
                    ? 'Cela fait suite à un changement de producteur déclaré sur Potentiel.'
                    : '',
              },
            },
          ];
        },
      )
      .with(
        { type: 'UtilisateurInvité-V1' },
        async ({ payload: { identifiantUtilisateur, rôle } }) => {
          const templateId = match(rôle)
            .returnType<number>()
            .with('dreal', () => templateIds.utilisateurInvité.dreal)
            .with(
              P.union(
                'acheteur-obligé',
                'grd',
                'caisse-des-dépôts',
                'ademe',
                'dgec-validateur',
                'cre',
                'admin',
              ),
              () => templateIds.utilisateurInvité.partenaires,
            )
            .exhaustive();

          return [
            {
              templateId,
              messageSubject: `Invitation à suivre les projets sur Potentiel`,
              recipients: [{ email: identifiantUtilisateur }],
              variables: {
                invitation_link: urlPageProjets,
              },
            },
          ];
        },
      )
      .with({ type: 'ProjetRéclamé-V1' }, async () => [])
      .exhaustive();

    await Promise.all(emailPayloads.map(sendEmail));
  };

  mediator.register('System.Notification.Utilisateur', handler);
};

const récupérerNomProjet = async (identifiantProjet: IdentifiantProjet.RawType) => {
  const lauréat = await mediator.send<Lauréat.ConsulterLauréatQuery>({
    type: 'Lauréat.Query.ConsulterLauréat',
    data: {
      identifiantProjet,
    },
  });
  if (Option.isSome(lauréat)) {
    return lauréat.nomProjet;
  }
  const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
    type: 'Candidature.Query.ConsulterCandidature',
    data: {
      identifiantProjet,
    },
  });
  if (Option.isSome(candidature)) {
    return candidature.nomProjet;
  }

  return '';
};
