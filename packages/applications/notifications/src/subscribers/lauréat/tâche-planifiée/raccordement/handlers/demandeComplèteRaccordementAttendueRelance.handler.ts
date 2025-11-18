import { Routes } from '@potentiel-applications/routes';

import { listerPorteursRecipients } from '#helpers';

import { TâchePlanifiéeRaccordementNotificationProps } from '../tâche-planifiée.raccordement.notifications.js';

export const handleDemandeComplèteRaccordementAttendueRelance = async ({
  sendEmail,
  identifiantProjet,
  projet: { nom, département },
  baseUrl,
}: TâchePlanifiéeRaccordementNotificationProps) => {
  const porteurs = await listerPorteursRecipients(identifiantProjet);

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
};
