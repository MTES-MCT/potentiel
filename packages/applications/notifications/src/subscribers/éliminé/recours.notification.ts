import { Message, MessageHandler, mediator } from 'mediateur';
import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  récupérerPorteursParIdentifiantProjetAdapter,
  CandidatureAdapter,
} from '@potentiel-infrastructure/domain-adapters';
import { sendEmail } from '../../infrastructure/sendEmail';
import { Routes } from '@potentiel-applications/routes';
import { Recours } from '@potentiel-domain/elimine';

export type SubscriptionEvent = Recours.RecoursEvent & Event;

export type Execute = Message<'System.Notification.Eliminé.Recours', SubscriptionEvent>;

const templateId = {
  recours: {
    accorder: 1,
    annuler: 1,
    demander: 1,
    rejeter: 1,
  },
};

const sendEmailRecoursChangementDeStatut = async ({
  identifiantProjet,
  statut,
  templateId,
  recipients,
  nomProjet,
  départementProjet,
  appelOffre,
  période,
}: {
  identifiantProjet: IdentifiantProjet.ValueType;
  statut: 'demandé' | 'annulé' | 'accordé' | 'rejeté';
  templateId: number;
  recipients: Array<{ email: string; fullName: string }>;
  nomProjet: string;
  départementProjet: string;
  appelOffre: string;
  période: string;
}) => {
  const { BASE_URL } = process.env;

  await sendEmail({
    templateId,
    messageSubject: `Potentiel - Recours ${statut} pour le projet ${nomProjet} (${appelOffre} période ${période})`,
    recipients,
    variables: {
      nom_projet: nomProjet,
      departement_projet: départementProjet,
      nouveau_statut: statut,
      recours_url: `${BASE_URL}${Routes.Recours.détail(identifiantProjet.formatter())}`,
    },
  });
};

/**
 *
 * @todo vérifier les urls de redirection des mails vers les différentes pages recours
 */
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

    switch (event.type) {
      case 'RecoursDemandé-V1':
        await sendEmailRecoursChangementDeStatut({
          statut: 'demandé',
          templateId: templateId.recours.demander,
          recipients: [...porteurs, ...admins],
          identifiantProjet,
          nomProjet,
          départementProjet,
          appelOffre,
          période,
        });
        break;
      case 'RecoursAnnulé-V1':
        await sendEmailRecoursChangementDeStatut({
          statut: 'annulé',
          templateId: templateId.recours.annuler,
          recipients: [...porteurs, ...admins],
          identifiantProjet,
          nomProjet,
          départementProjet,
          appelOffre,
          période,
        });
        break;
      case 'RecoursAccordé-V1':
        await sendEmailRecoursChangementDeStatut({
          statut: 'accordé',
          templateId: templateId.recours.accorder,
          recipients: porteurs,
          identifiantProjet,
          nomProjet,
          départementProjet,
          appelOffre,
          période,
        });
        break;
      case 'RecoursRejeté-V1':
        await sendEmailRecoursChangementDeStatut({
          statut: 'rejeté',
          templateId: templateId.recours.rejeter,
          recipients: porteurs,
          identifiantProjet,
          nomProjet,
          départementProjet,
          appelOffre,
          période,
        });
        break;
    }
  };

  mediator.register('System.Notification.Eliminé.Recours', handler);
};
