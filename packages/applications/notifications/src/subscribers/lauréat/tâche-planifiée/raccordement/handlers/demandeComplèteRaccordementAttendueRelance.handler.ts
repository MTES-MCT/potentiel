import { listerPorteursRecipients } from '@/helpers';

import { Routes } from '@potentiel-applications/routes';
import { getLogger } from '@potentiel-libraries/monitoring';

import { TâchePlanifiéeRaccordementNotificationProps } from '../tâche-planifiée.raccordement.notifications';

export const handleDemandeComplèteRaccordementAttendueRelance = async ({
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
