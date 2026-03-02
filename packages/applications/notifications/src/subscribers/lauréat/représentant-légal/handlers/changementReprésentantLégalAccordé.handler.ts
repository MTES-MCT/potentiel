import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getBaseUrl, getLauréat, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleChangementReprésentantLégalAccordé = async ({
  payload,
}: Lauréat.ReprésentantLégal.ChangementReprésentantLégalAccordéEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);

  const porteurs = await listerPorteursRecipients(projet.identifiantProjet);

  return sendEmail({
    key: 'lauréat/représentant-légal/demande/accorder',
    recipients: porteurs,
    values: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      appel_offre: projet.identifiantProjet.appelOffre,
      période: projet.identifiantProjet.période,
      url: `${getBaseUrl()}${Routes.ReprésentantLégal.changement.détailsPourRedirection(projet.identifiantProjet.formatter())}`,
    },
  });
};
