import { Routes } from '@potentiel-applications/routes';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerPorteursRecipients } from '../../../../_helpers';

import { TâchePlanifiéeRaccordementNotificationProps } from '.';

export const demandeComplèteRaccordementAttendueRelanceNotification = async ({
  sendEmail,
  identifiantProjet,
  projet: { nom, département },
  baseUrl,
}: TâchePlanifiéeRaccordementNotificationProps) => {
  const porteurs = await listerPorteursRecipients(identifiantProjet);

  if (porteurs.length === 0) {
    getLogger().error('Aucun porteur trouvé', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'demandeComplèteRaccordementAttendueRelanceNotification',
    });
  } else {
    await sendEmail({
      messageSubject: `Potentiel - Attente de transmission de la DCR pour le projet ${nom}`,
      recipients: porteurs,
      templateId: 7207011,
      variables: {
        nom_projet: nom,
        departement_projet: département,
        url: `${baseUrl}${Routes.Raccordement.transmettreDemandeComplèteRaccordement(identifiantProjet.formatter())}`,
      },
    });
  }
};
