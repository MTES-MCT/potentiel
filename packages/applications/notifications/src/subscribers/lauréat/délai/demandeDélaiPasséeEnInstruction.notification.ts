import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Routes } from '@potentiel-applications/routes';

import { listerDrealsRecipients, listerPorteursRecipients } from '../../../helpers';

import { RegisterDélaiNotificationDependencies } from '.';

import { délaiNotificationTemplateId } from './constant';

type demandeDélaiPasséeEnInstructionNotificationProps = {
  sendEmail: RegisterDélaiNotificationDependencies['sendEmail'];
  event: Lauréat.Délai.DemandeDélaiPasséeEnInstructionEvent;
  projet: {
    nom: string;
    département: string;
    région: string;
    url: string;
  };
  baseUrl: string;
};

export const demandeDélaiPasséeEnInstructionNotification = async ({
  sendEmail,
  event,
  projet,
  baseUrl,
}: demandeDélaiPasséeEnInstructionNotificationProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  const messageSubject = `Potentiel - La demande de délai pour le projet ${projet.nom} situé dans le département ${projet.département} est en instruction`;

  const url = `${baseUrl}${Routes.Délai.détail(identifiantProjet.formatter(), event.payload.dateDemande)}`;

  if (dreals.length === 0) {
    getLogger().info('Aucune dreal trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'demandeDélaiPasséeEnInstructionNotification',
    });
  } else {
    await sendEmail({
      templateId: délaiNotificationTemplateId.demande.passerEnInstruction,
      messageSubject,
      recipients: dreals,
      variables: {
        nom_projet: projet.nom,
        departement_projet: projet.département,
        url,
      },
    });
  }

  const porteurs = await listerPorteursRecipients(identifiantProjet);

  if (porteurs.length === 0) {
    getLogger().error('Aucune porteur trouvé', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'demandeDélaiPasséeEnInstructionNotification',
    });
  } else {
    await sendEmail({
      templateId: délaiNotificationTemplateId.demande.passerEnInstruction,
      messageSubject,
      recipients: porteurs,
      variables: {
        nom_projet: projet.nom,
        departement_projet: projet.département,
        url,
      },
    });
  }
};
