import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Option } from '@potentiel-libraries/monads';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Recours } from '@potentiel-domain/elimine';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import {
  CandidatureAdapter,
  listerUtilisateursAdapter,
  récupérerPorteursParIdentifiantProjetAdapter,
} from '@potentiel-infrastructure/domain-adapters';
import { Role } from '@potentiel-domain/utilisateur';

import { SendEmail } from '../../sendEmail';

export type SubscriptionEvent = Recours.RecoursEvent & Event;

export type Execute = Message<'System.Notification.Éliminé.Recours', SubscriptionEvent>;

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

    const projet = await CandidatureAdapter.récupérerProjetAdapter(identifiantProjet.formatter());
    const porteurs = await récupérerPorteursParIdentifiantProjetAdapter(identifiantProjet);

    if (Option.isNone(projet) || porteurs.length === 0 || !process.env.DGEC_EMAIL) {
      return;
    }
    const { BASE_URL } = process.env;

    const admins = [
      {
        email: process.env.DGEC_EMAIL,
        fullName: 'DGEC',
      },
    ];
    const nomProjet = projet.nom;
    const départementProjet = projet.localité.département;
    const appelOffre = projet.appelOffre;
    const période = projet.période;
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
            ? `${BASE_URL}${Routes.Projet.details(identifiantProjet.formatter())}`
            : `${BASE_URL}${Routes.Recours.détail(identifiantProjet.formatter())}`,
      },
    });

    if (event.type === 'RecoursAccordé-V1') {
      const utilisateursCre = await listerUtilisateursAdapter([Role.cre.nom]);
      const recipients = utilisateursCre.map(({ email, nomComplet }) => ({
        email,
        fullName: nomComplet,
      }));

      if (recipients.length > 0) {
        await sendEmail({
          templateId: templateId.recoursAccordéCRE,
          messageSubject: `Potentiel - Un recours a été accepté pour le projet ${nomProjet} (${appelOffre} période ${période})`,
          recipients,
          variables: {
            nom_projet: nomProjet,
            modification_request_url: `${BASE_URL}${Routes.Recours.détail(identifiantProjet.formatter())}`,
          },
        });
      }
    }
  };

  mediator.register('System.Notification.Éliminé.Recours', handler);
};
