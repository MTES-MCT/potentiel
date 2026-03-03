import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import {
  getLauréat,
  getBaseUrl,
  listerDrealsRecipients,
  listerPorteursRecipients,
  formatDateForEmail,
} from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleGarantiesFinancièresÉchues = async ({
  payload,
}: Lauréat.GarantiesFinancières.GarantiesFinancièresÉchuesEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);
  const porteurs = await listerPorteursRecipients(projet.identifiantProjet);

  const values = {
    nom_projet: projet.nom,
    departement_projet: projet.département,
    appel_offre: projet.identifiantProjet.appelOffre,
    période: projet.identifiantProjet.période,
    date_echeance: formatDateForEmail(new Date(payload.dateÉchéance)),
    url: `${getBaseUrl()}${Routes.GarantiesFinancières.détail(projet.identifiantProjet.formatter())}`,
  };

  await sendEmail({
    key: 'lauréat/garanties-financières/échoir_dreal',
    recipients: dreals,
    values,
  });

  await sendEmail({
    key: 'lauréat/garanties-financières/échoir_porteur',
    recipients: porteurs,
    values,
  });
};
