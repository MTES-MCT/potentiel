import { Routes } from '@potentiel-applications/routes';

import { listerPorteursRecipients, listerDrealsRecipients, getLauréat, getBaseUrl } from '#helpers';
import { sendEmail } from '#sendEmail';

import { TâchePlanifiéeGarantiesFinancièresNotificationProps } from '../tâche-planifiée.garantiesFinancières.notifications.js';

type GarantiesFinancièresRappelÉchéanceNotificationProps =
  TâchePlanifiéeGarantiesFinancièresNotificationProps & {
    nombreDeMois: number;
  };

export const handleGarantiesFinancièresRappelÉchéance = async ({
  identifiantProjet,
  nombreDeMois,
}: GarantiesFinancièresRappelÉchéanceNotificationProps) => {
  const lauréat = await getLauréat(identifiantProjet.formatter());

  const porteursRecipients = await listerPorteursRecipients(identifiantProjet);
  const drealsRecipients = await listerDrealsRecipients(lauréat.région);

  const commonValues = {
    nom_projet: lauréat.nom,
    appel_offre: lauréat.identifiantProjet.appelOffre,
    période: lauréat.identifiantProjet.période,
    departement_projet: lauréat.département,
    nombre_mois: nombreDeMois.toString(),
  };

  await sendEmail({
    key: 'lauréat/garanties-financières/rappel_gf_echeance_porteur',
    recipients: porteursRecipients,
    values: {
      ...commonValues,
      url: `${getBaseUrl()}${Routes.GarantiesFinancières.dépôt.soumettre(identifiantProjet.formatter())}`,
    },
  });

  await sendEmail({
    key: 'lauréat/garanties-financières/rappel_gf_echeance_dreal',
    recipients: drealsRecipients,
    values: {
      ...commonValues,
      url: `${getBaseUrl()}${Routes.GarantiesFinancières.détail(identifiantProjet.formatter())}`,
    },
  });
};
