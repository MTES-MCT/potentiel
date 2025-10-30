import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Routes } from '@potentiel-applications/routes';

import { listerPorteursRecipients } from '../../../_helpers';

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

  const porteurs = await listerPorteursRecipients(identifiantProjet);

  if (porteurs.length === 0) {
    getLogger().error('Aucune porteur trouvé', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'demandeDélaiPasséeEnInstructionNotification',
    });
    return;
  }

  await sendEmail({
    templateId: délaiNotificationTemplateId.demande.passerEnInstruction,
    messageSubject: `Potentiel - La demande de délai pour le projet ${projet.nom} est en instruction`,
    recipients: porteurs,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.Délai.détail(identifiantProjet.formatter(), event.payload.dateDemande)}`,
    },
  });
};
