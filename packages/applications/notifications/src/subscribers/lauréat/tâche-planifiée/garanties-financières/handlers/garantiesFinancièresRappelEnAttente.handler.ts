import { Routes } from '@potentiel-applications/routes';

import { listerPorteursRecipients, listerDrealsRecipients, getLauréat, getBaseUrl } from '#helpers';
import { sendEmail } from '#sendEmail';

import { TâchePlanifiéeGarantiesFinancièresNotificationProps } from '../tâche-planifiée.garantiesFinancières.notifications.js';

export const handleGarantiesFinancièresRappelEnAttente = async ({
  identifiantProjet,
}: TâchePlanifiéeGarantiesFinancièresNotificationProps) => {
  const lauréat = await getLauréat(identifiantProjet.formatter());

  const porteursRecipients = await listerPorteursRecipients(identifiantProjet);
  const drealsRecipients = await listerDrealsRecipients(lauréat.région);

  const commonValues = {
    nom_projet: lauréat.nom,
    appel_offre: lauréat.identifiantProjet.appelOffre,
    période: lauréat.identifiantProjet.période,
    departement_projet: lauréat.département,
  };

  await sendEmail({
    key: 'lauréat/garanties-financières/rappel_gf_en_attente_porteur',
    recipients: porteursRecipients,
    values: {
      ...commonValues,
      url: `${getBaseUrl()}${Routes.GarantiesFinancières.dépôt.soumettre(identifiantProjet.formatter())}`,
    },
  });

  await sendEmail({
    key: 'lauréat/garanties-financières/rappel_gf_en_attente_dreal',
    recipients: drealsRecipients,
    values: {
      ...commonValues,
      url: lauréat.url,
    },
  });
};
