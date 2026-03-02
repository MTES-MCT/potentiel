import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { getBaseUrl, getLauréat, listerDrealsRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleChangementReprésentantLégalDemandé = async ({
  payload,
}: Lauréat.ReprésentantLégal.ChangementReprésentantLégalDemandéEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);

  const recipients = await listerDrealsRecipients(projet.région);

  return sendEmail({
    key: 'lauréat/représentant-légal/demande/demander',
    recipients,
    values: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      appel_offre: projet.identifiantProjet.appelOffre,
      période: projet.identifiantProjet.période,
      url: `${getBaseUrl()}${Routes.ReprésentantLégal.changement.détails(projet.identifiantProjet.formatter(), payload.demandéLe)}`,
    },
  });
};
