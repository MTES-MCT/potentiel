import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Recours } from '@potentiel-domain/elimine';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import {
  CandidatureAdapter,
  récupérerPorteursParIdentifiantProjetAdapter,
} from '@potentiel-infrastructure/domain-adapters';

import { EmailPayload, SendEmail } from '../../sendEmail';

export type SubscriptionEvent = Recours.RecoursEvent & Event;

export type Execute = Message<'System.Notification.Recours', SubscriptionEvent>;

const templateId = 6310637;

const getStatutByEventType = (type: SubscriptionEvent['type']) => {
  switch (type) {
    case 'RecoursDemandé-V1':
      return 'demandée';
    case 'RecoursAnnulé-V1':
      return 'annulée';
    case 'RecoursAccordé-V1':
      return 'accordée';
    case 'RecoursRejeté-V1':
      return 'rejetée';
  }
};

async function getEmailPayload(event: SubscriptionEvent): Promise<EmailPayload | undefined> {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);

  const projet = await CandidatureAdapter.récupérerProjetAdapter(identifiantProjet.formatter());
  const porteurs = await récupérerPorteursParIdentifiantProjetAdapter(identifiantProjet);

  if (Option.isNone(projet) || porteurs.length === 0 || !process.env.DGEC_EMAIL) {
    return;
  }

  const nomProjet = projet.nom;
  const départementProjet = projet.localité.département;
  const appelOffre = projet.appelOffre;
  const période = projet.période;

  const admins = [
    {
      email: process.env.DGEC_EMAIL,
      fullName: 'DGEC',
    },
  ];

  const { BASE_URL } = process.env;

  return {
    templateId,
    messageSubject: `Potentiel - Demande de recours ${getStatutByEventType(event.type)} pour le projet ${nomProjet} (${appelOffre} période ${période})`,
    recipients: [...porteurs, ...admins],
    variables: {
      nom_projet: nomProjet,
      departement_projet: départementProjet,
      statut: getStatutByEventType(event.type),
      demande_recours_url: `${BASE_URL}${Routes.Recours.détail(identifiantProjet.formatter())}`,
    },
  };
}

export type RegisterRecoursNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterRecoursNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const payload = await getEmailPayload(event);
    if (payload) {
      await sendEmail(payload);
    }
  };

  mediator.register('System.Notification.Recours', handler);
};
