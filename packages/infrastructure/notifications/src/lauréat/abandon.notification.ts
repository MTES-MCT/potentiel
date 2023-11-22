import { Message, MessageHandler, mediator } from 'mediateur';
import { sendEmail } from '@potentiel/email-sender';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { isNone } from '@potentiel/monads';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { RécupérerPorteursProjetPort } from '@potentiel/domain-views';
import { Abandon } from '@potentiel-domain/laureat';
import { RécupérerCandidaturePort } from '@potentiel-domain/candidature';
import { templateId } from '../templateId';

export type SubscriptionEvent = Abandon.AbandonEvent & Event;

export type Execute = Message<'EXECUTE_LAUREAT_ABANDON_NOTIFICATION', SubscriptionEvent>;

type Dependencies = {
  récupérerCandidature: RécupérerCandidaturePort;
  récupérerPorteursProjet: RécupérerPorteursProjetPort;
};

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

    const abandon_url = `/laureat/${encodeURIComponent(identifiantProjet.formatter())}/abandon`;

    switch (event.type) {
      case 'AbandonDemandé-V1':
        await sendEmail({
          templateId: templateId.abandon.demander,
          messageSubject: `Potentiel - Demande d'abandon envoyée pour le projet ${projet.nom} (${projet.appelOffre} période ${projet.période})`,
          recipients: [...porteurs, ...admins],
          variables: {
            nom_projet: projet.nom,
            departement_projet: projet.localité.département,
            nouveau_statut: 'envoyée',
            abandon_url,
          },
        });
        break;
      case 'AbandonAnnulé-V1':
        await sendEmail({
          templateId: templateId.abandon.annuler,
          messageSubject: `Potentiel - Demande d'abandon annulée pour le projet ${projet.nom} (${projet.appelOffre} période ${projet.période})`,
          recipients: [...porteurs, ...admins],
          variables: {
            nom_projet: projet.nom,
            departement_projet: projet.localité.département,
            nouveau_statut: 'annulée',
            abandon_url,
          },
        });
        break;
      case 'ConfirmationAbandonDemandée-V1':
        await sendEmail({
          templateId: templateId.abandon.demanderConfirmation,
          messageSubject: `Potentiel - Demande d'abandon en attente de confirmation pour le projet ${projet.nom} (${projet.appelOffre} période ${projet.période})`,
          recipients: porteurs,
          variables: {
            nom_projet: projet.nom,
            departement_projet: projet.localité.département,
            nouveau_statut: 'en attente de confirmation',
            abandon_url,
          },
        });
        break;
      case 'AbandonConfirmé-V1':
        await sendEmail({
          templateId: templateId.abandon.confirmer,
          messageSubject: `Potentiel - Demande d'abandon confirmée pour le projet ${projet.nom} (${projet.appelOffre} période ${projet.période})`,
          recipients: [...porteurs, ...admins],
          variables: {
            nom_projet: projet.nom,
            departement_projet: projet.localité.département,
            nouveau_statut: 'confirmée',
            abandon_url,
          },
        });
        break;
      case 'AbandonAccordé-V1':
        await sendEmail({
          templateId: templateId.abandon.accorder,
          messageSubject: `Potentiel - Demande d'abandon accordée pour le projet ${projet.nom} (${projet.appelOffre} période ${projet.période})`,
          recipients: [...porteurs, ...admins],
          variables: {
            nom_projet: projet.nom,
            departement_projet: projet.localité.département,
            nouveau_statut: 'accordée',
            abandon_url,
          },
        });
        break;
      case 'AbandonRejeté-V1':
        await sendEmail({
          templateId: templateId.abandon.accorder,
          messageSubject: `Potentiel - Demande d'abandon rejetée pour le projet ${projet.nom} (${projet.appelOffre} période ${projet.période})`,
          recipients: [...porteurs, ...admins],
          variables: {
            nom_projet: projet.nom,
            departement_projet: projet.localité.département,
            nouveau_statut: 'rejetée',
            abandon_url,
          },
        });
        break;
      case 'PreuveRecandidatureDemandée-V1':
        await sendEmail({
          templateId: templateId.abandon.demanderPreuveRecandidature,
          messageSubject: `Potentiel - Transmettre une preuve de recandidature suite à l'abandon du projet ${projet.nom} ((${projet.appelOffre} période ${projet.période}))`,
          recipients: porteurs,
          variables: {
            lien_transmettre_preuve_recandidature: `/laureat/${encodeURIComponent(
              identifiantProjet.formatter(),
            )}/abandon/preuve-recandidature`,
          },
        });
        break;
    }
  };

  mediator.register('EXECUTE_LAUREAT_ABANDON_NOTIFICATION', handler);
};
