import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';
import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { EmailPayload, SendEmail } from '../../sendEmail';
import { listerPorteursRecipients } from '../../helpers/listerPorteursRecipients';
import { listerDrealsRecipients } from '../../helpers/listerDrealsRecipients';

export type SubscriptionEvent = Lauréat.Achèvement.AchèvementEvent & Event;

export type Execute = Message<
  'System.Notification.Lauréat.Achèvement.AttestationConformité',
  SubscriptionEvent
>;

const templateId = {
  attestationConformitéTransmiseDreal: 5945568,
  attestationConformitéTransmisePorteur: 6409011,
};

async function getEmailPayload(event: SubscriptionEvent): Promise<EmailPayload[]> {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const projet = await CandidatureAdapter.récupérerProjetAdapter(identifiantProjet.formatter());

  if (Option.isNone(projet)) {
    return [];
  }

  const porteurs = await listerPorteursRecipients(identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.localité.région);
  const nomProjet = projet.nom;
  const départementProjet = projet.localité.département;
  const { BASE_URL } = process.env;

  switch (event.type) {
    case 'AttestationConformitéTransmise-V1':
      const variables = {
        nom_projet: nomProjet,
        departement_projet: départementProjet,
        url: `${BASE_URL}${Routes.Projet.details(identifiantProjet.formatter())}`,
      };
      return [
        {
          templateId: templateId.attestationConformitéTransmiseDreal,
          messageSubject: `Potentiel - Une attestation de conformité a été transmise pour le projet ${nomProjet} dans le département ${départementProjet}`,
          recipients: dreals,
          variables,
        },
        {
          templateId: templateId.attestationConformitéTransmisePorteur,
          messageSubject: `Potentiel - Mise à jour de la date d'achèvement du projet ${nomProjet} dans le département ${départementProjet}`,
          recipients: porteurs,
          variables,
        },
      ];
  }
  return [];
}

export type RegisterAchèvementNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterAchèvementNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const payloads = await getEmailPayload(event);
    for (const payload of payloads) {
      await sendEmail(payload);
    }
  };

  mediator.register('System.Notification.Lauréat.Achèvement.AttestationConformité', handler);
};
