import { Message, MessageHandler, mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';

import {
  formatDateForEmail,
  getBaseUrl,
  getLauréat,
  listerDrealsRecipients,
  listerPorteursRecipients,
} from '../../helpers';
import { EmailPayload, SendEmail } from '../../sendEmail';

export type SubscriptionEvent = Lauréat.GarantiesFinancières.GarantiesFinancièresEvent & Event;

export type Execute = Message<
  'System.Notification.Lauréat.GarantiesFinancières',
  SubscriptionEvent
>;

const templateId = {
  dépôtSoumisPourDreal: 5740312,
  dépôtSoumisPourPorteur: 5740394,
  dépôtValidéPourPorteur: 5765321,
  attestationGFActuellesEnregistréePourDreal: 5765406,
  GFActuellesModifiéesPourPorteur: 5765519,
  GFActuellesModifiéesPourDreal: 5765536,
  mainlevéeGFDemandéePourDreal: 6025932,
  mainlevéeGFStatutModifiéPourPorteur: 6051452,
  GFÉchuesPourPorteur: 6154951,
  GFÉchuesPourDreal: 6155012,
};

type FormatGarantiesFinancièresEmailPayload = {
  identifiantProjet: IdentifiantProjet.ValueType;
  subject: string;
  templateId: number;
  recipients: EmailPayload['recipients'];

  nomProjet: string;
  départementProjet: string;
  régionProjet: string;
  statut?: 'validées' | 'en attente de validation';
  dateÉchéance?: string;
};

const formatGarantiesFinancièresEmailPayload = ({
  identifiantProjet,
  templateId,
  recipients,
  nomProjet,
  départementProjet,
  régionProjet,
  subject,
  statut,
  dateÉchéance,
}: FormatGarantiesFinancièresEmailPayload): EmailPayload | undefined => {
  if (recipients.length === 0) {
    return;
  }

  return {
    templateId,
    messageSubject: subject,
    recipients,
    variables: {
      nom_projet: nomProjet,
      departement_projet: départementProjet,
      region_projet: régionProjet,
      nouveau_statut: statut ?? '',
      date_echeance: dateÉchéance ?? '',
      url: `${getBaseUrl()}${Routes.GarantiesFinancières.détail(identifiantProjet.formatter())}`,
    },
  };
};

async function getEmailPayloads(event: SubscriptionEvent): Promise<(EmailPayload | undefined)[]> {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const projet = await getLauréat(identifiantProjet.formatter());

  const porteurs = await listerPorteursRecipients(identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  const nomProjet = projet.nom;
  const départementProjet = projet.département;
  const régionProjet = projet.région;

  switch (event.type) {
    case 'DépôtGarantiesFinancièresSoumis-V1':
      return [
        formatGarantiesFinancièresEmailPayload({
          statut: 'en attente de validation',
          subject: `Potentiel - Des garanties financières sont en attente de validation pour le projet ${nomProjet} dans le département ${départementProjet}`,
          templateId: templateId.dépôtSoumisPourDreal,
          recipients: dreals,
          identifiantProjet,
          nomProjet,
          départementProjet,
          régionProjet,
        }),

        formatGarantiesFinancièresEmailPayload({
          statut: 'en attente de validation',
          subject: `Potentiel - Des garanties financières sont en attente de validation pour le projet ${nomProjet} dans le département ${départementProjet}`,
          templateId: templateId.dépôtSoumisPourPorteur,
          recipients: porteurs,
          identifiantProjet,
          nomProjet,
          départementProjet,
          régionProjet,
        }),
      ];

    case 'DépôtGarantiesFinancièresEnCoursValidé-V1':
    case 'DépôtGarantiesFinancièresEnCoursValidé-V2':
      return [
        formatGarantiesFinancièresEmailPayload({
          statut: 'validées',
          subject: `Potentiel - Des garanties financières sont validées pour le projet ${nomProjet} dans le département ${départementProjet}`,
          templateId: templateId.dépôtValidéPourPorteur,
          recipients: porteurs,
          identifiantProjet,
          nomProjet,
          départementProjet,
          régionProjet,
        }),
      ];

    case 'AttestationGarantiesFinancièresEnregistrée-V1':
      return [
        formatGarantiesFinancièresEmailPayload({
          subject: `Potentiel - Attestation de constitution des garanties financières enregistrée pour le projet ${nomProjet} dans le département ${départementProjet}`,
          templateId: templateId.attestationGFActuellesEnregistréePourDreal,
          recipients: dreals,
          identifiantProjet,
          nomProjet,
          départementProjet,
          régionProjet,
        }),
      ];
      break;

    case 'GarantiesFinancièresModifiées-V1':
    case 'GarantiesFinancièresEnregistrées-V1':
      return [
        formatGarantiesFinancièresEmailPayload({
          subject: `Potentiel - Garanties financières mises à jour pour le projet ${nomProjet} dans le département ${départementProjet}`,
          templateId: templateId.GFActuellesModifiéesPourDreal,
          recipients: dreals,
          identifiantProjet,
          nomProjet,
          départementProjet,
          régionProjet,
        }),

        formatGarantiesFinancièresEmailPayload({
          subject: `Potentiel - Garanties financières mises à jour pour le projet ${nomProjet} dans le département ${départementProjet}`,
          templateId: templateId.GFActuellesModifiéesPourPorteur,
          recipients: porteurs,
          identifiantProjet,
          nomProjet,
          départementProjet,
          régionProjet,
        }),
      ];

    case 'MainlevéeGarantiesFinancièresDemandée-V1':
      return [
        formatGarantiesFinancièresEmailPayload({
          subject: `Potentiel - Demande de mainlevée des garanties financières pour le projet ${nomProjet} dans le département ${départementProjet}`,
          templateId: templateId.mainlevéeGFDemandéePourDreal,
          recipients: dreals,
          identifiantProjet,
          nomProjet,
          départementProjet,
          régionProjet,
        }),
      ];

    case 'InstructionDemandeMainlevéeGarantiesFinancièresDémarrée-V1':
    case 'DemandeMainlevéeGarantiesFinancièresAccordée-V1':
    case 'DemandeMainlevéeGarantiesFinancièresRejetée-V1':
      return [
        formatGarantiesFinancièresEmailPayload({
          subject: `Potentiel - Le statut de la demande de mainlevée des garanties financières a été modifié pour le projet ${nomProjet}`,
          templateId: templateId.mainlevéeGFStatutModifiéPourPorteur,
          recipients: porteurs,
          identifiantProjet,
          nomProjet,
          départementProjet,
          régionProjet,
        }),
      ];

    case 'GarantiesFinancièresÉchues-V1':
      return [
        formatGarantiesFinancièresEmailPayload({
          subject: `Potentiel - Date d'échéance dépassée pour les garanties financières du projet ${nomProjet} dans le département ${départementProjet}`,
          templateId: templateId.GFÉchuesPourPorteur,
          recipients: porteurs,
          identifiantProjet,
          nomProjet,
          départementProjet,
          régionProjet,
          dateÉchéance: formatDateForEmail(new Date(event.payload.dateÉchéance)),
        }),
        formatGarantiesFinancièresEmailPayload({
          subject: `Potentiel - Date d'échéance dépassée pour les garanties financières du projet ${nomProjet} dans le département ${départementProjet}`,
          templateId: templateId.GFÉchuesPourDreal,
          recipients: dreals,
          identifiantProjet,
          nomProjet,
          départementProjet,
          régionProjet,
          dateÉchéance: formatDateForEmail(new Date(event.payload.dateÉchéance)),
        }),
      ];
    default:
      return [];
  }
}

export type RegisterGarantiesFinancièresNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterGarantiesFinancièresNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const payloads = await getEmailPayloads(event);
    for (const payload of payloads) {
      if (payload) {
        await sendEmail(payload);
      }
    }
  };

  mediator.register('System.Notification.Lauréat.GarantiesFinancières', handler);
};
