import { Routes } from '@potentiel-applications/routes';
import type { Lauréat } from '@potentiel-domain/projet';

import { buildUrl, getLauréat, listerDrealsRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleMainlevéeDemandée = async ({
  payload,
}: Lauréat.GarantiesFinancières.MainlevéeGarantiesFinancièresDemandéeEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  await sendEmail({
    key: 'lauréat/garanties-financières/mainlevée/demander',
    recipients: dreals,
    values: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      appel_offre: projet.identifiantProjet.appelOffre,
      période: projet.identifiantProjet.période,
      url: buildUrl(Routes.GarantiesFinancières.détail(projet.identifiantProjet.formatter())),
    },
  });
};
