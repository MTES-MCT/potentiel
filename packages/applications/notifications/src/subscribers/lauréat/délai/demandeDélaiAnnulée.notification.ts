import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerDrealsRecipients } from '../../../helpers';

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
  const dreals = await listerDrealsRecipients(projet.région);

  if (dreals.length === 0) {
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
    recipients: dreals,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });
};
