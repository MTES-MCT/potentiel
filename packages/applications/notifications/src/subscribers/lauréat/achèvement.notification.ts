import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  CandidatureAdapter,
  récupérerDrealsParIdentifiantProjetAdapter,
} from '@potentiel-infrastructure/domain-adapters';
import { Achèvement } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';

import { EmailPayload, SendEmail } from '../../sendEmail';

export type SubscriptionEvent = Achèvement.AchèvementEvent & Event;

export type Execute = Message<
  'System.Notification.Lauréat.Achèvement.AttestationConformité',
  SubscriptionEvent
>;

const templateId = {
  attestationConformitéTransmise: 5945568,
};

async function getEmailPayload(event: SubscriptionEvent): Promise<EmailPayload | undefined> {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const projet = await CandidatureAdapter.récupérerProjetAdapter(identifiantProjet.formatter());

  if (Option.isNone(projet)) {
    return;
  }

  const dreals = await récupérerDrealsParIdentifiantProjetAdapter(identifiantProjet);
  const nomProjet = projet.nom;
  const départementProjet = projet.localité.département;
  const régionProjet = projet.localité.région;
  const { BASE_URL } = process.env;

  switch (event.type) {
    case 'AttestationConformitéTransmise-V1':
      return {
        templateId: templateId.attestationConformitéTransmise,
        messageSubject: `Potentiel - Une attestation de conformité a été transmise pour le projet ${nomProjet} dans le département ${départementProjet}`,
        recipients: dreals,
        copyRecipients: [],
        hiddenCopyRecipients: [],
        variables: {
          nom_projet: nomProjet,
          departement_projet: départementProjet,
          region_projet: régionProjet,
          url: `${BASE_URL}${Routes.Projet.details(identifiantProjet.formatter())}`,
        },
      };
  }
}

export type RegisterAchèvementNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterAchèvementNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const payload = await getEmailPayload(event);
    if (payload) {
      await sendEmail(payload);
    }
  };

  mediator.register('System.Notification.Lauréat.Achèvement.AttestationConformité', handler);
};
