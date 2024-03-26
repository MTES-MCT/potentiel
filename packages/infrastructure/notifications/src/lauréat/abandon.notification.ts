import { Message, MessageHandler, mediator } from 'mediateur';
import { sendEmail } from '@potentiel-librairies/email-sender';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Option } from '@potentiel-librairies/monads';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  récupérerPorteursParIdentifiantProjetAdapter,
  CandidatureAdapter,
} from '@potentiel-infrastructure/domain-adapters';
import { Abandon } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-libraries/routes';
import { templateId } from '../templateId';

export type SubscriptionEvent = Abandon.AbandonEvent & Event;

export type Execute = Message<'System.Notification.Lauréat.Abandon', SubscriptionEvent>;

const sendEmailAbandonChangementDeStatut = async ({
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
  statut:
    | 'envoyée'
    | 'annulée'
    | 'en attente de confirmation'
    | 'confirmée'
    | 'accordée'
    | 'rejetée';
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
    messageSubject: `Potentiel - Demande d'abandon ${statut} pour le projet ${nomProjet} (${appelOffre} période ${période})`,
    recipients,
    variables: {
      nom_projet: nomProjet,
      departement_projet: départementProjet,
      nouveau_statut: statut,
      abandon_url: `${BASE_URL}${Routes.Abandon.détail(identifiantProjet.formatter())}`,
    },
  });
};

/**
 *
 * @todo vérifier les urls de redirection des mails vers les différentes pages abandons
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
      // Que faire ?
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

    switch (event.type) {
      case 'AbandonDemandé-V1':
        await sendEmailAbandonChangementDeStatut({
          statut: 'envoyée',
          templateId: templateId.abandon.demander,
          recipients: [...porteurs, ...admins],
          identifiantProjet,
          nomProjet,
          départementProjet,
          appelOffre,
          période,
        });
        break;
      case 'AbandonAnnulé-V1':
        await sendEmailAbandonChangementDeStatut({
          statut: 'annulée',
          templateId: templateId.abandon.annuler,
          recipients: [...porteurs, ...admins],
          identifiantProjet,
          nomProjet,
          départementProjet,
          appelOffre,
          période,
        });
        break;
      case 'ConfirmationAbandonDemandée-V1':
        await sendEmailAbandonChangementDeStatut({
          statut: 'en attente de confirmation',
          templateId: templateId.abandon.demanderConfirmation,
          recipients: porteurs,
          identifiantProjet,
          nomProjet,
          départementProjet,
          appelOffre,
          période,
        });
        break;
      case 'AbandonConfirmé-V1':
        await sendEmailAbandonChangementDeStatut({
          statut: 'confirmée',
          templateId: templateId.abandon.demanderConfirmation,
          recipients: [...porteurs, ...admins],
          identifiantProjet,
          nomProjet,
          départementProjet,
          appelOffre,
          période,
        });
        break;
      case 'AbandonAccordé-V1':
        await sendEmailAbandonChangementDeStatut({
          statut: 'accordée',
          templateId: templateId.abandon.accorder,
          recipients: porteurs,
          identifiantProjet,
          nomProjet,
          départementProjet,
          appelOffre,
          période,
        });
        break;
      case 'AbandonRejeté-V1':
        await sendEmailAbandonChangementDeStatut({
          statut: 'rejetée',
          templateId: templateId.abandon.rejeter,
          recipients: porteurs,
          identifiantProjet,
          nomProjet,
          départementProjet,
          appelOffre,
          période,
        });
        break;
      case 'PreuveRecandidatureDemandée-V1':
        await sendEmail({
          templateId: templateId.abandon.demanderPreuveRecandidature,
          messageSubject: `Potentiel - Transmettre une preuve de recandidature suite à l'abandon du projet ${projet.nom} (${projet.appelOffre} période ${projet.période})`,
          recipients: porteurs,
          variables: {
            nom_projet: projet.nom,
            lien_transmettre_preuve_recandidature: `${BASE_URL}${Routes.Abandon.transmettrePreuveRecandidature(
              identifiantProjet.formatter(),
            )}/`,
          },
        });
        break;
    }
  };

  mediator.register('System.Notification.Lauréat.Abandon', handler);
};
