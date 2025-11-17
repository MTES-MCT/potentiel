import { Routes } from '@potentiel-applications/routes';

import { listerPorteursRecipients, listerDrealsRecipients } from '#helpers';

import { TâchePlanifiéeGarantiesFinancièresNotificationProps } from '../tâche-planifiée.garantiesFinancières.notifications.js';

export const handleGarantiesFinancièresRappelEnAttente = async ({
  sendEmail,
  identifiantProjet,
  projet: { nom, région, département },
  baseUrl,
}: TâchePlanifiéeGarantiesFinancièresNotificationProps) => {
  const porteurs = await listerPorteursRecipients(identifiantProjet);
  const dreals = await listerDrealsRecipients(région);

  const messageSubject = `Potentiel - Garanties financières en attente pour le projet ${nom} dans le département ${département}`;
  await sendEmail({
    messageSubject,
    recipients: porteurs,
    templateId: 7174524,
    variables: {
      nom_projet: nom,
      departement_projet: département,
      url: `${baseUrl}${Routes.GarantiesFinancières.dépôt.soumettre(identifiantProjet.formatter())}`,
    },
  });

  await sendEmail({
    messageSubject,
    recipients: dreals,
    templateId: 7174559,
    variables: {
      nom_projet: nom,
      departement_projet: département,
      url: `${baseUrl}${Routes.Projet.details(identifiantProjet.formatter())}`,
    },
  });
};
