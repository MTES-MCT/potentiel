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

    const chargésAffaire = porteurs.filter((porteur) => porteur.email === projet.email);

    switch (event.type) {
      case 'AbandonDemandé-V1':
        const abandon_demandé_url = `/laureat/${encodeURIComponent(
          identifiantProjet.formatter(),
        )}/abandon`;

        await sendEmail({
          templateId: templateId.abandon.demander.porteur,
          messageSubject: `Votre demande d'abandon pour le projet ${projet.nom}`,
          recipients: porteurs,
          variables: {
            nom_projet: projet.nom,
            abandon_demandé_url,
          },
        });

        await sendEmail({
          templateId: templateId.abandon.demander.admin,
          messageSubject: `Potentiel - Nouvelle demande d'abandon pour un projet ${projet.appelOffre} période ${projet.période}`,
          recipients: admins,
          variables: {
            nom_projet: projet.nom,
            departement_projet: projet.localité.département,
            abandon_demandé_url,
          },
        });
        break;
      case 'AbandonAnnulé-V1':
        const abandon_annulé_url = `/laureat/${encodeURIComponent(
          identifiantProjet.formatter(),
        )}/abandon`;

        await sendEmail({
          templateId: templateId.abandon.annuler.porteur,
          messageSubject: `Votre demande d'abandon pour le projet ${projet.nom}`,
          recipients: porteurs,
          variables: {
            nom_projet: projet.nom,
            abandon_annulé_url,
          },
        });

        await sendEmail({
          templateId: templateId.abandon.annuler.admin,
          messageSubject: `Potentiel - Demande d'abandon annulée pour un projet ${projet.appelOffre} période ${projet.période}`,
          recipients: admins,
          variables: {
            nom_projet: projet.nom,
            departement_projet: projet.localité.département,
            abandon_annulé_url,
          },
        });

        if (chargésAffaire.length > 0) {
          await sendEmail({
            templateId: templateId.abandon.annuler.chargéAffaire,
            messageSubject: `Potentiel - Demande d'abandon annulée pour un projet ${projet.appelOffre} période ${projet.période}`,
            recipients: chargésAffaire,
            variables: {
              nom_projet: projet.nom,
              departement_projet: projet.localité.département,
              abandon_annulé_url,
            },
          });
        }
        break;
      case 'ConfirmationAbandonDemandée-V1':
        const confirmation_abandon_demandée_url = `/laureat/${encodeURIComponent(
          identifiantProjet.formatter(),
        )}/abandon`;
        await sendEmail({
          templateId: templateId.abandon.demanderConfirmation.porteur,
          messageSubject: `Votre demande d'abandon pour le projet ${projet.nom}`,
          recipients: porteurs,
          variables: {
            nom_projet: projet.nom,
            confirmation_abandon_demandée_url,
          },
        });
        break;
      case 'AbandonConfirmé-V1':
        const abandon_confirmé_url = `/laureat/${encodeURIComponent(
          identifiantProjet.formatter(),
        )}/abandon`;
        await sendEmail({
          templateId: templateId.abandon.confirmer.porteur,
          messageSubject: `Votre demande d'abandon pour le projet ${projet.nom}`,
          recipients: porteurs,
          variables: {
            nom_projet: projet.nom,
            abandon_confirmé_url,
          },
        });

        await sendEmail({
          templateId: templateId.abandon.confirmer.admin,
          messageSubject: `Potentiel - Demande d'abandon confirmée pour un projet ${projet.appelOffre} période ${projet.période}`,
          recipients: admins,
          variables: {
            nom_projet: projet.nom,
            departement_projet: projet.localité.département,
            abandon_confirmé_url,
          },
        });

        if (chargésAffaire.length > 0) {
          await sendEmail({
            templateId: templateId.abandon.confirmer.chargéAffaire,
            messageSubject: `Potentiel - Demande d'abandon confirmée pour un projet ${projet.appelOffre} période ${projet.période}`,
            recipients: chargésAffaire,
            variables: {
              nom_projet: projet.nom,
              departement_projet: projet.localité.département,
              abandon_confirmé_url,
            },
          });
        }
        break;
      case 'AbandonAccordé-V1':
        const abandon_accordé_url = `/laureat/${encodeURIComponent(
          identifiantProjet.formatter(),
        )}/abandon`;
        await sendEmail({
          templateId: templateId.abandon.accorder.porteur,
          messageSubject: `Votre demande d'abandon pour le projet ${projet.nom}`,
          recipients: porteurs,
          variables: {
            nom_projet: projet.nom,
            abandon_accordé_url,
          },
        });
        break;
      case 'AbandonRejeté-V1':
        const abandon_rejeté_url = `/laureat/${encodeURIComponent(
          identifiantProjet.formatter(),
        )}/abandon`;
        await sendEmail({
          templateId: templateId.abandon.rejeter.porteur,
          messageSubject: `Votre demande d'abandon pour le projet ${projet.nom}`,
          recipients: porteurs,
          variables: {
            nom_projet: projet.nom,
            abandon_rejeté_url,
          },
        });
        break;
      case 'PreuveRecandidatureDemandée-V1':
        await sendEmail({
          templateId: templateId.abandon.demanderPreuveRecandidature.porteur,
          messageSubject: `Transmettre une preuve de recandidature suite à l'abandon du projet ${projet.nom}`,
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
