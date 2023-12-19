import { Message, MessageHandler, mediator } from 'mediateur';
import { sendEmail } from '@potentiel/email-sender';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { isNone } from '@potentiel/monads';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { RécupérerPorteursProjetPort } from '@potentiel/domain-views';
import { Abandon } from '@potentiel-domain/laureat';
import { CandidatureProjection, RécupérerCandidaturePort } from '@potentiel-domain/candidature';
import { templateId } from '../templateId';

export type SubscriptionEvent = Abandon.AbandonEvent & Event;

export type Execute = Message<'EXECUTE_LAUREAT_ABANDON_NOTIFICATION', SubscriptionEvent>;

type Dependencies = {
  récupérerCandidature: RécupérerCandidaturePort;
  récupérerPorteursProjet: RécupérerPorteursProjetPort;
};

const sendEmailAbandonChangementDeStatut = async ({
  identifiantProjet,
  statut,
  templateId,
  recipients,
  projet,
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
  projet: CandidatureProjection;
}) =>
  await sendEmail({
    templateId,
    messageSubject: `Potentiel - Demande d'abandon ${statut} pour le projet ${projet.nom} (${projet.appelOffre} période ${projet.période})`,
    recipients,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.localité.département,
      nouveau_statut: statut,
      abandon_url: `/laureat/${encodeURIComponent(identifiantProjet.formatter())}/abandon`,
    },
  });

/**
 *
 * @todo vérifier les urls de redirection des mails vers les différentes pages abandons
 */
export const register = ({ récupérerCandidature, récupérerPorteursProjet }: Dependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      event.payload.identifiantProjet,
    );
    const projet = await récupérerCandidature(identifiantProjet.formatter());
    const porteurs = await récupérerPorteursProjet(identifiantProjet);

    if (isNone(projet) || porteurs.length === 0 || !process.env.DGEC_EMAIL) {
      // Que faire ?
      return;
    }

    const admins = [
      {
        email: process.env.DGEC_EMAIL,
        fullName: 'DGEC',
      },
    ];

    switch (event.type) {
      case 'AbandonDemandé-V1':
        await sendEmailAbandonChangementDeStatut({
          statut: 'envoyée',
          templateId: templateId.abandon.demander,
          recipients: [...porteurs, ...admins],
          identifiantProjet,
          projet,
        });
        break;
      case 'AbandonAnnulé-V1':
        await sendEmailAbandonChangementDeStatut({
          statut: 'annulée',
          templateId: templateId.abandon.annuler,
          recipients: [...porteurs, ...admins],
          identifiantProjet,
          projet,
        });
        break;
      case 'ConfirmationAbandonDemandée-V1':
        await sendEmailAbandonChangementDeStatut({
          statut: 'en attente de confirmation',
          templateId: templateId.abandon.demanderConfirmation,
          recipients: porteurs,
          identifiantProjet,
          projet,
        });
        break;
      case 'AbandonConfirmé-V1':
        await sendEmailAbandonChangementDeStatut({
          statut: 'confirmée',
          templateId: templateId.abandon.demanderConfirmation,
          recipients: [...porteurs, ...admins],
          identifiantProjet,
          projet,
        });
        break;
      case 'AbandonAccordé-V1':
        await sendEmailAbandonChangementDeStatut({
          statut: 'accordée',
          templateId: templateId.abandon.accorder,
          recipients: porteurs,
          identifiantProjet,
          projet,
        });
        break;
      case 'AbandonRejeté-V1':
        await sendEmailAbandonChangementDeStatut({
          statut: 'rejetée',
          templateId: templateId.abandon.rejeter,
          recipients: porteurs,
          identifiantProjet,
          projet,
        });
        break;
      case 'PreuveRecandidatureDemandée-V1':
        await sendEmail({
          templateId: templateId.abandon.demanderPreuveRecandidature,
          messageSubject: `Potentiel - Transmettre une preuve de recandidature suite à l'abandon du projet ${projet.nom} (${projet.appelOffre} période ${projet.période})`,
          recipients: porteurs,
          variables: {
            nom_projet: projet.nom,
            lien_transmettre_preuve_recandidature: `/laureat/${encodeURIComponent(
              identifiantProjet.formatter(),
            )}/abandon/transmettre-preuve-recandidature`,
          },
        });
        break;
    }
  };

  mediator.register('EXECUTE_LAUREAT_ABANDON_NOTIFICATION', handler);
};
