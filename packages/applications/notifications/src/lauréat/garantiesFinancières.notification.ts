import { Message, MessageHandler, mediator } from 'mediateur';
import { sendEmail } from '@potentiel-librairies/email-sender';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Option } from '@potentiel-librairies/monads';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  récupérerPorteursParIdentifiantProjetAdapter,
  CandidatureAdapter,
  récupérerDrealsParIdentifiantProjetAdapter,
} from '@potentiel-infrastructure/domain-adapters';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';
import { templateId } from '../templateId';

export type SubscriptionEvent = GarantiesFinancières.GarantiesFinancièresEvent & Event;

export type Execute = Message<
  'System.Notification.Lauréat.GarantiesFinancières',
  SubscriptionEvent
>;

const sendEmailGarantiesFinancièresChangementDeStatut = async ({
  identifiantProjet,
  templateId,
  recipients,
  nomProjet,
  départementProjet,
  régionProjet,
  subject,
  statut,
}: {
  identifiantProjet: IdentifiantProjet.ValueType;
  subject: string;
  templateId: number;
  recipients: Array<{ email: string; fullName: string }>;
  nomProjet: string;
  départementProjet: string;
  régionProjet: string;
  statut?: 'validées' | 'en attente de validation';
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
      nouveau_statut: statut ?? '',
      url: `${BASE_URL}${Routes.GarantiesFinancières.détail(identifiantProjet.formatter())}`,
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

    const porteurs = await récupérerPorteursParIdentifiantProjetAdapter(identifiantProjet);

    if (Option.isNone(projet) || porteurs.length === 0 || !process.env.DGEC_EMAIL) {
      return;
    }

    const dreals = await récupérerDrealsParIdentifiantProjetAdapter(identifiantProjet);

    const nomProjet = projet.nom;
    const départementProjet = projet.localité.département;
    const régionProjet = projet.localité.région;

    switch (event.type) {
      case 'DépôtGarantiesFinancièresSoumis-V1':
        await sendEmailGarantiesFinancièresChangementDeStatut({
          statut: 'en attente de validation',
          subject: `Potentiel - Des garanties financières sont en attente de validation pour le projet ${nomProjet} dans le département ${départementProjet}`,
          templateId: templateId.garantiesFinancières.dépôtSoumisPourDreal,
          recipients: dreals,
          identifiantProjet,
          nomProjet,
          départementProjet,
          régionProjet,
        });

        await sendEmailGarantiesFinancièresChangementDeStatut({
          statut: 'en attente de validation',
          subject: `Potentiel - Des garanties financières sont en attente de validation pour le projet ${nomProjet} dans le département ${départementProjet}`,
          templateId: templateId.garantiesFinancières.dépôtSoumisPourPorteur,
          recipients: porteurs,
          identifiantProjet,
          nomProjet,
          départementProjet,
          régionProjet,
        });
        break;

      case 'DépôtGarantiesFinancièresEnCoursValidé-V1':
        await sendEmailGarantiesFinancièresChangementDeStatut({
          statut: 'validées',
          subject: `Potentiel - Des garanties financières sont validées pour le projet ${nomProjet} dans le département ${départementProjet}`,
          templateId: templateId.garantiesFinancières.dépôtValidéPourPorteur,
          recipients: porteurs,
          identifiantProjet,
          nomProjet,
          départementProjet,
          régionProjet,
        });
        break;

      case 'AttestationGarantiesFinancièresEnregistrée-V1':
        await sendEmailGarantiesFinancièresChangementDeStatut({
          subject: `Potentiel - Attestation de constitution des garanties financières enregistrée pour le projet ${nomProjet} dans le département ${départementProjet}`,
          templateId: templateId.garantiesFinancières.attestationGFActuellesEnregistréePourDreal,
          recipients: dreals,
          identifiantProjet,
          nomProjet,
          départementProjet,
          régionProjet,
        });
        break;

      case 'GarantiesFinancièresModifiées-V1':
      case 'GarantiesFinancièresEnregistrées-V1':
        await sendEmailGarantiesFinancièresChangementDeStatut({
          subject: `Potentiel - Garanties financières mises à jour pour le projet ${nomProjet} dans le département ${départementProjet}`,
          templateId: templateId.garantiesFinancières.GFActuellesModifiéesPourDreal,
          recipients: dreals,
          identifiantProjet,
          nomProjet,
          départementProjet,
          régionProjet,
        });

        await sendEmailGarantiesFinancièresChangementDeStatut({
          subject: `Potentiel - Garanties financières mises à jour pour le projet ${nomProjet} dans le département ${départementProjet}`,
          templateId: templateId.garantiesFinancières.GFActuellesModifiéesPourPorteur,
          recipients: porteurs,
          identifiantProjet,
          nomProjet,
          départementProjet,
          régionProjet,
        });
        break;
    }
  };

  mediator.register('System.Notification.Lauréat.GarantiesFinancières', handler);
};
