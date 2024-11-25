import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  CandidatureAdapter,
  récupérerPorteursParIdentifiantProjetAdapter,
} from '@potentiel-infrastructure/domain-adapters';
import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';

import { EmailPayload, SendEmail } from '../../sendEmail';

export type SubscriptionEvent = ReprésentantLégal.ReprésentantLégalEvent & Event;

export type Execute = Message<'System.Notification.Lauréat.ReprésentantLégal', SubscriptionEvent>;

const templateId = {
  modifier: 6502927,
};

async function getEmailPayload(event: SubscriptionEvent): Promise<EmailPayload | undefined> {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const projet = await CandidatureAdapter.récupérerProjetAdapter(identifiantProjet.formatter());
  const porteurs = await récupérerPorteursParIdentifiantProjetAdapter(identifiantProjet);

  if (Option.isNone(projet) || porteurs.length === 0) {
    return;
  }

  const nomProjet = projet.nom;
  const départementProjet = projet.localité.département;
  const { BASE_URL } = process.env;

  switch (event.type) {
    case 'ReprésentantLégalModifié-V1':
      return {
        templateId: templateId.modifier,
        messageSubject: `Potentiel - Modification du représentant légal pour le projet ${nomProjet} dans le département ${départementProjet}`,
        recipients: porteurs,
        variables: {
          nom_projet: nomProjet,
          departement_projet: départementProjet,
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

  mediator.register('System.Notification.Lauréat.ReprésentantLégal', handler);
};
