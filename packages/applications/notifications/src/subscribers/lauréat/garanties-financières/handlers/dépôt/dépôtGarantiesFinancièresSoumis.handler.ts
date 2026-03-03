import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getBaseUrl, getLauréat, listerDrealsRecipients, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleDépôtGarantiesFinancièresSoumis = async ({
  payload,
}: Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresSoumisEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);

  const dreals = await listerDrealsRecipients(projet.région);
  const porteurs = await listerPorteursRecipients(projet.identifiantProjet);

  const values = {
    nom_projet: projet.nom,
    departement_projet: projet.département,
    region_projet: projet.région,
    appel_offre: projet.identifiantProjet.appelOffre,
    période: projet.identifiantProjet.période,
    url: `${getBaseUrl()}${Routes.GarantiesFinancières.détail(projet.identifiantProjet.formatter())}`,
  };

  await sendEmail({
    key: 'lauréat/garanties-financières/dépôt/soumettre_dreal',
    recipients: dreals,
    values,
  });

  await sendEmail({
    key: 'lauréat/garanties-financières/dépôt/soumettre_porteur',
    recipients: porteurs,
    values,
  });
};
