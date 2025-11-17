import { Routes } from '@potentiel-applications/routes';
import { getLogger } from '@potentiel-libraries/monitoring';

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

  if (porteurs.length === 0) {
    getLogger().error('Aucun porteur trouvé', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
    });
    return;
  }

  const dreals = await listerDrealsRecipients(région);

  if (dreals.length === 0) {
    getLogger().info('Aucune dreal trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
    });
    return;
  }

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
