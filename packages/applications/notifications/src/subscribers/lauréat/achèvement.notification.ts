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

import { sendEmail } from '../../infrastructure/sendEmail';

export type SubscriptionEvent = Achèvement.AchèvementEvent & Event;

export type Execute = Message<
  'System.Notification.Lauréat.Achèvement.AttestationConformité',
  SubscriptionEvent
>;

const templateId = {
  attestationConformitéTransmise: 5945568,
};

const sendEmailAchèvement = async ({
  identifiantProjet,
  templateId,
  recipients,
  nomProjet,
  départementProjet,
  régionProjet,
  subject,
}: {
  identifiantProjet: IdentifiantProjet.ValueType;
  subject: string;
  templateId: number;
  recipients: Array<{ email: string; fullName: string }>;
  nomProjet: string;
  départementProjet: string;
  régionProjet: string;
}) => {
  const { BASE_URL } = process.env;

  await sendEmail({
    templateId,
    messageSubject: subject,
    recipients,
    variables: {
      nom_projet: nomProjet,
      departement_projet: départementProjet,
      region_projet: régionProjet,
      url: `${BASE_URL}${Routes.Projet.details(identifiantProjet.formatter())}`,
    },
  });
};

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      event.payload.identifiantProjet,
    );
    const projet = await CandidatureAdapter.récupérerCandidatureAdapter(
      identifiantProjet.formatter(),
    );

    if (Option.isNone(projet)) {
      return;
    }

    const dreals = await récupérerDrealsParIdentifiantProjetAdapter(identifiantProjet);

    const nomProjet = projet.nom;
    const départementProjet = projet.localité.département;
    const régionProjet = projet.localité.région;

    switch (event.type) {
      case 'AttestationConformitéTransmise-V1':
        await sendEmailAchèvement({
          subject: `Potentiel - Une attestation de conformité a été transmise pour le projet ${nomProjet} dans le département ${départementProjet}`,
          templateId: templateId.attestationConformitéTransmise,
          recipients: dreals,
          identifiantProjet,
          nomProjet,
          départementProjet,
          régionProjet,
        });
        break;
    }
  };

  mediator.register('System.Notification.Lauréat.Achèvement.AttestationConformité', handler);
};
