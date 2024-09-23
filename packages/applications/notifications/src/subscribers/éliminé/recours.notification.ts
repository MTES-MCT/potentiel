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

import { SendEmail } from '../../sendEmail';

export type SubscriptionEvent = Recours.RecoursEvent & Event;

export type Execute = Message<'System.Notification.Éliminé.Recours', SubscriptionEvent>;

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
    const statut = getStatutByEventType(event.type);

    await sendEmail({
      templateId,
      messageSubject: `Potentiel - Demande de recours ${statut} pour le projet ${nomProjet} (${appelOffre} période ${période})`,
      recipients: [...porteurs, ...admins],
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
  };

  mediator.register('System.Notification.Éliminé.Recours', handler);
};
