import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  récupérerPorteursParIdentifiantProjetAdapter,
  CandidatureAdapter,
} from '@potentiel-infrastructure/domain-adapters';
import { Abandon } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';

import { EmailPayload, SendEmail } from '../../sendEmail';

export type SubscriptionEvent = Abandon.AbandonEvent & Event;

export type Execute = Message<'System.Notification.Lauréat.Abandon', SubscriptionEvent>;

const abandonChangementStatutTemplateId = 5335914;

const templateId = {
  accorder: abandonChangementStatutTemplateId,
  annuler: abandonChangementStatutTemplateId,
  confirmer: abandonChangementStatutTemplateId,
  demander: abandonChangementStatutTemplateId,
  demanderConfirmation: abandonChangementStatutTemplateId,
  rejeter: abandonChangementStatutTemplateId,
  demanderPreuveRecandidature: 5308275,
};

type SendEmailAbandonChangementDeStatut = {
  identifiantProjet: IdentifiantProjet.ValueType;
  statut:
    | 'envoyée'
    | 'annulée'
    | 'en attente de confirmation'
    | 'confirmée'
    | 'accordée'
    | 'rejetée';
  templateId: EmailPayload['templateId'];
  recipients: EmailPayload['recipients'];
  cc?: EmailPayload['cc'];
  bcc?: EmailPayload['cc'];
  nomProjet: string;
  départementProjet: string;
  appelOffre: string;
  période: string;
};
const sendEmailAbandonChangementDeStatut = ({
  identifiantProjet,
  statut,
  templateId,
  recipients,
  cc,
  bcc,
  nomProjet,
  départementProjet,
  appelOffre,
  période,
}: SendEmailAbandonChangementDeStatut) => {
  const { BASE_URL } = process.env;

  return {
    templateId,
    messageSubject: `Potentiel - Demande d'abandon ${statut} pour le projet ${nomProjet} (${appelOffre} période ${période})`,
    recipients,
    ...(cc && { cc }),
    ...(bcc && { bcc }),
    variables: {
      nom_projet: nomProjet,
      departement_projet: départementProjet,
      nouveau_statut: statut,
      abandon_url: `${BASE_URL}${Routes.Abandon.détail(identifiantProjet.formatter())}`,
    },
  };
};

async function getEmailPayload(event: SubscriptionEvent): Promise<EmailPayload | undefined> {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const projet = await CandidatureAdapter.récupérerProjetAdapter(identifiantProjet.formatter());
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

  const { BASE_URL } = process.env;

  switch (event.type) {
    case 'AbandonDemandé-V1':
    case 'AbandonDemandé-V2':
      return sendEmailAbandonChangementDeStatut({
        statut: 'envoyée',
        templateId: templateId.demander,
        recipients: porteurs,
        bcc: admins,
        identifiantProjet,
        nomProjet,
        départementProjet,
        appelOffre,
        période,
      });
    case 'AbandonAnnulé-V1':
      return sendEmailAbandonChangementDeStatut({
        statut: 'annulée',
        templateId: templateId.annuler,
        recipients: porteurs,
        bcc: admins,
        identifiantProjet,
        nomProjet,
        départementProjet,
        appelOffre,
        période,
      });
    case 'ConfirmationAbandonDemandée-V1':
      return sendEmailAbandonChangementDeStatut({
        statut: 'en attente de confirmation',
        templateId: templateId.demanderConfirmation,
        recipients: porteurs,
        identifiantProjet,
        nomProjet,
        départementProjet,
        appelOffre,
        période,
      });
    case 'AbandonConfirmé-V1':
      return sendEmailAbandonChangementDeStatut({
        statut: 'confirmée',
        templateId: templateId.demanderConfirmation,
        recipients: porteurs,
        bcc: admins,
        identifiantProjet,
        nomProjet,
        départementProjet,
        appelOffre,
        période,
      });
    case 'AbandonAccordé-V1':
      return sendEmailAbandonChangementDeStatut({
        statut: 'accordée',
        templateId: templateId.accorder,
        recipients: porteurs,
        identifiantProjet,
        nomProjet,
        départementProjet,
        appelOffre,
        période,
      });
    case 'AbandonRejeté-V1':
      return sendEmailAbandonChangementDeStatut({
        statut: 'rejetée',
        templateId: templateId.rejeter,
        recipients: porteurs,
        identifiantProjet,
        nomProjet,
        départementProjet,
        appelOffre,
        période,
      });
    case 'PreuveRecandidatureDemandée-V1':
      return {
        templateId: templateId.demanderPreuveRecandidature,
        messageSubject: `Potentiel - Transmettre une preuve de recandidature suite à l'abandon du projet ${projet.nom} (${projet.appelOffre} période ${projet.période})`,
        recipients: porteurs,
        variables: {
          nom_projet: projet.nom,
          lien_transmettre_preuve_recandidature: `${BASE_URL}${Routes.Abandon.détail(
            identifiantProjet.formatter(),
          )}/`,
        },
      };
  }
}

export type RegisterAbandonNotificationDependencies = {
  sendEmail: SendEmail;
};

/**
 *
 * @todo vérifier les urls de redirection des mails vers les différentes pages abandons
 */
export const register = ({ sendEmail }: RegisterAbandonNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const payload = await getEmailPayload(event);
    if (payload) {
      await sendEmail(payload);
    }
  };

  mediator.register('System.Notification.Lauréat.Abandon', handler);
};
