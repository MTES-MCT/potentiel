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

    const modification_request_url = `/laureat/${encodeURIComponent(
      identifiantProjet.formatter(),
    )}/abandon`;

    switch (event.type) {
      case 'AbandonDemandé-V1':
        await sendEmail({
          templateId: templateId.abandon.demander.porteur,
          messageSubject: `Votre demande de type abandon pour le projet ${projet.nom}`,
          recipients: porteurs,
          variables: {
            nom_projet: projet.nom,
            type_demande: 'abandon',
            status: 'envoyée',
            modification_request_url,
          },
        });

        // notifier un admin, en se basant sur une variable d'environnement pour le mail ? wtf dude
        await sendEmail({
          templateId: templateId.abandon.demander.admin,
          messageSubject: `Potentiel - Nouvelle demande de type abandon pour un projet ${projet.appelOffre} période ${projet.période}`,
          recipients: [
            {
              email: process.env.DGEC_EMAIL,
              fullName: '???????',
            },
          ],
          variables: {
            nom_projet: projet.nom,
            departement_projet: projet.localité.département,
            type_demande: `abandon`,
            modification_request_url,
          },
        });
        break;
      case 'AbandonAccordé-V1':
        await sendEmail({
          templateId: templateId.abandon.accorder,
          messageSubject: `Votre demande de type abandon pour le projet ${projet.nom}`,
          recipients: porteurs,
          variables: {
            nom_projet: projet.nom,
            type_demande: 'abandon',
            status: 'acceptée',
            modification_request_url,
          },
        });
        break;
      case 'AbandonRejeté-V1':
        await sendEmail({
          templateId: templateId.abandon.rejeter,
          messageSubject: `Votre demande de type abandon pour le projet ${projet.nom}`,
          recipients: porteurs,
          variables: {
            nom_projet: projet.nom,
            type_demande: 'abandon',
            status: 'rejetée',
            modification_request_url,
          },
        });
        break;
      case 'PreuveRecandidatureDemandée-V1':
        await sendEmail({
          templateId: templateId.abandon.demanderPreuveRecandidature,
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
