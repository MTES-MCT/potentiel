import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { getBaseUrl, getLauréat, listerDrealsRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleChangementPuissanceDemandé = async ({
  payload,
}: Lauréat.Puissance.ChangementPuissanceDemandéEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);

  const dreals = await listerDrealsRecipients(projet.région);

  return sendEmail({
    key: 'lauréat/puissance/demande/demander',
    recipients: dreals,
    values: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      appel_offre: projet.identifiantProjet.appelOffre,
      période: projet.identifiantProjet.période,
      url: `${getBaseUrl()}${Routes.Puissance.changement.détails(projet.identifiantProjet.formatter(), payload.demandéLe)}`,
    },
  });
};
