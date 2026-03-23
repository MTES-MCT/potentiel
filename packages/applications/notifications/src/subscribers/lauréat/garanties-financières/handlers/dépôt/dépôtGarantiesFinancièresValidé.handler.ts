import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getBaseUrl, listerPorteursRecipients } from '#helpers';
import { getLauréat } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleDépôtGarantiesFinancièresValidé = async ({
  payload,
}: Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursValidéEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);

  const porteurs = await listerPorteursRecipients(projet.identifiantProjet);

  await sendEmail({
    key: 'lauréat/garanties-financières/dépôt/valider',
    recipients: porteurs,
    values: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      appel_offre: projet.identifiantProjet.appelOffre,
      période: projet.identifiantProjet.période,
      url: `${getBaseUrl()}${Routes.GarantiesFinancières.détail(projet.identifiantProjet.formatter())}`,
    },
  });
};
