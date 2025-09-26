import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerRecipientsAutoritéInstructrice } from '../../../helpers/listerRecipientsAutoritéInstructrice';

import { RegisterDélaiNotificationDependencies } from '.';

import { délaiNotificationTemplateId } from './constant';

type DemandeDélaiAnnuléeNotificationProps = {
  sendEmail: RegisterDélaiNotificationDependencies['sendEmail'];
  event: Lauréat.Délai.DemandeDélaiAnnuléeEvent;
  projet: {
    nom: string;
    département: string;
    région: string;
    url: string;
  };
};

export const demandeDélaiAnnuléeNotification = async ({
  sendEmail,
  event,
  projet,
}: DemandeDélaiAnnuléeNotificationProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const recipients = await listerRecipientsAutoritéInstructrice({
    identifiantProjet,
    région: projet.région,
    domain: 'délai',
  });

  if (recipients.length === 0) {
    getLogger().info('Aucune dreal trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'DemandeDélaiAnnuléeNotification',
    });
    return;
  }

  return sendEmail({
    templateId: délaiNotificationTemplateId.demande.annuler,
    messageSubject: `Potentiel - La demande de délai pour le projet ${projet.nom} situé dans le département ${projet.département} a été annulée`,
    recipients,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });
};
