import { Routes } from '@potentiel-applications/routes';

import { listerPorteursRecipients, listerDrealsRecipients } from '#helpers';

import { TâchePlanifiéeGarantiesFinancièresNotificationProps } from '../tâche-planifiée.garantiesFinancières.notifications.js';

type GarantiesFinancièresRappelÉchéanceNotificationProps = Omit<
  TâchePlanifiéeGarantiesFinancièresNotificationProps,
  'payload'
> & {
  nombreDeMois: number;
};

export const handleGarantiesFinancièresRappelÉchéance = async ({
  sendEmail,
  identifiantProjet,
  projet: { nom, région, département },
  baseUrl,
  nombreDeMois,
}: GarantiesFinancièresRappelÉchéanceNotificationProps) => {
  const porteurs = await listerPorteursRecipients(identifiantProjet);

  const dreals = await listerDrealsRecipients(région);

  await sendEmail({
    messageSubject: `Potentiel - Arrivée à échéance des garanties financières pour le projet ${nom} dans ${nombreDeMois} mois`,
    recipients: dreals,
    templateId: 6164034,
    variables: {
      nom_projet: nom,
      departement_projet: département,
      nombre_mois: nombreDeMois.toString(),
      url: `${baseUrl}${Routes.GarantiesFinancières.détail(identifiantProjet.formatter())}`,
    },
  });

  await sendEmail({
    messageSubject: `Potentiel - Arrivée à échéance de vos garanties financières pour le projet ${nom} dans ${nombreDeMois} mois`,
    recipients: porteurs,
    templateId: 6164049,
    variables: {
      nom_projet: nom,
      departement_projet: département,
      nombre_mois: nombreDeMois.toString(),
      url: `${baseUrl}${Routes.GarantiesFinancières.détail(identifiantProjet.formatter())}`,
    },
  });
};
