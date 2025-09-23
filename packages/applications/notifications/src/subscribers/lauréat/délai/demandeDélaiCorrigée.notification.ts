import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerRecipientsAutoritéInstructrice } from '../../../helpers/listerRecipientsAutoritéInstructrice';

import { RegisterDélaiNotificationDependencies } from '.';

import { délaiNotificationTemplateId } from './constant';

type DemandeDélaiCorrigéeNotificationProps = {
  sendEmail: RegisterDélaiNotificationDependencies['sendEmail'];
  event: Lauréat.Délai.DemandeDélaiCorrigéeEvent;
  projet: {
    nom: string;
    département: string;
    région: string;
  };
  baseUrl: string;
};

export const demandeDélaiCorrigéeNotification = async ({
  sendEmail,
  event,
  projet,
  baseUrl,
}: DemandeDélaiCorrigéeNotificationProps) => {
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
      fonction: 'délaiDemandéNotification',
    });
    return;
  }

  return sendEmail({
    templateId: délaiNotificationTemplateId.demande.corriger,
    messageSubject: `Potentiel - Correction de la demande de délai pour le projet ${projet.nom} situé dans le département ${projet.département}`,
    recipients,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.Délai.détail(identifiantProjet.formatter(), event.payload.dateDemande)}`,
    },
  });
};
