import { IdentifiantProjet } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Routes } from '@potentiel-applications/routes';
import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { listerPorteursRecipients } from '../../../helpers/listerPorteursRecipients';

import { RegisterReprésentantLégalNotificationDependencies } from '.';

type ReprésentantLégalModifiéNotificationProps = {
  sendEmail: RegisterReprésentantLégalNotificationDependencies['sendEmail'];
  event: ReprésentantLégal.ReprésentantLégalModifiéEvent;
  projet: {
    nom: string;
    département: string;
    région: string;
  };
  baseUrl: string;
};

export const représentantLégalModifiéNotification = async ({
  sendEmail,
  event,
  projet,
  baseUrl,
}: ReprésentantLégalModifiéNotificationProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteurs = await listerPorteursRecipients(identifiantProjet);

  if (porteurs.length === 0) {
    getLogger().error('Aucun porteur trouvé', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'représentantLégalModifiéNotification',
    });
    return;
  }

  return sendEmail({
    templateId: 6502927,
    messageSubject: `Potentiel - Modification du représentant légal pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: porteurs,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.Projet.details(identifiantProjet.formatter())}`,
    },
  });
};
