import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import {
  buildUrl,
  formatDateForEmail,
  getLauréat,
  listerDrealsRecipients,
  listerPorteursRecipients,
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
    url: buildUrl(Routes.GarantiesFinancières.détail(projet.identifiantProjet.formatter())),
  };

  await sendEmail({
    key: 'lauréat/garanties-financières/actuelles/échoir_dreal',
    recipients: dreals,
    values,
  });

  await sendEmail({
    key: 'lauréat/garanties-financières/actuelles/échoir_porteur',
    recipients: porteurs,
    values,
  });
};
