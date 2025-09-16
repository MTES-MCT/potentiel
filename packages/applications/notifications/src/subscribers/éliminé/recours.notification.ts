import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, Éliminé } from '@potentiel-domain/projet';
import { ListerUtilisateursQuery, Role } from '@potentiel-domain/utilisateur';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Option } from '@potentiel-libraries/monads';

import { getBaseUrl, getCandidature, listerPorteursRecipients } from '../../helpers';
import { SendEmail } from '../../sendEmail';

export type SubscriptionEvent = Éliminé.Recours.RecoursEvent & Event;

export type Execute = Message<'System.Notification.Eliminé.Recours', SubscriptionEvent>;

const templateId = {
  changementStatutRecours: 6310637,
  recoursAccordéCRE: 6189222,
};

export type RegisterRecoursNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterRecoursNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      event.payload.identifiantProjet,
    );

    const projet = await getCandidature(identifiantProjet.formatter());
    const porteurs = await listerPorteursRecipients(identifiantProjet);
    if (Option.isNone(projet) || porteurs.length === 0 || !process.env.DGEC_EMAIL) {
      return;
    }
    const baseUrl = getBaseUrl();

    const admins = [
      {
        email: process.env.DGEC_EMAIL,
        fullName: 'DGEC',
      },
    ];
    const nomProjet = projet.nom;
    const départementProjet = projet.département;
    const appelOffre = identifiantProjet.appelOffre;
    const période = identifiantProjet.période;
    const statut = match(event.type)
      .with('RecoursDemandé-V1', () => 'demandée')
      .with('RecoursAnnulé-V1', () => 'annulée')
      .with('RecoursAccordé-V1', () => 'accordée')
      .with('RecoursRejeté-V1', () => 'rejetée')
      .otherwise(() => '');

    await sendEmail({
      templateId: templateId.changementStatutRecours,
      messageSubject: `Potentiel - Demande de recours ${statut} pour le projet ${nomProjet} (${appelOffre} période ${période})`,
      recipients: porteurs,
      bcc: admins,
      variables: {
        nom_projet: nomProjet,
        departement_projet: départementProjet,
        statut,
        redirect_url:
          statut === 'annulée'
            ? `${baseUrl}${Routes.Projet.details(identifiantProjet.formatter())}`
            : `${baseUrl}${Routes.Recours.détail(identifiantProjet.formatter())}`,
      },
    });

    if (event.type === 'RecoursAccordé-V1' || event.type === 'RecoursRejeté-V1') {
      const utilisateursCre = await mediator.send<ListerUtilisateursQuery>({
        type: 'Utilisateur.Query.ListerUtilisateurs',
        data: {
          roles: [Role.cre.nom],
          actif: true,
        },
      });
      const recipients = utilisateursCre.items.map(({ email }) => ({
        email,
      }));

      if (recipients.length > 0) {
        await sendEmail({
          templateId: templateId.recoursAccordéCRE,
          messageSubject: `Potentiel - Demande de recours ${statut} pour le projet ${nomProjet} (${appelOffre} période ${période})`,
          recipients,
          variables: {
            nom_projet: nomProjet,
            redirect_url: `${baseUrl}${Routes.Recours.détail(identifiantProjet.formatter())}`,
          },
        });
      }
    }
  };

  mediator.register('System.Notification.Eliminé.Recours', handler);
};
