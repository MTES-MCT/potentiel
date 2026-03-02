import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getBaseUrl, getLauréat, listerDrealsRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleChangementReprésentantLégalAnnulé = async ({
  payload,
}: Lauréat.ReprésentantLégal.ChangementReprésentantLégalAnnuléEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);
  const recipients = await listerDrealsRecipients(projet.région);

  return sendEmail({
    key: 'lauréat/représentant-légal/demande/annuler',
    recipients,
    values: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      appel_offre: projet.identifiantProjet.appelOffre,
      période: projet.identifiantProjet.période,
      url: `${getBaseUrl()}${Routes.ReprésentantLégal.changement.détailsPourRedirection(projet.identifiantProjet.formatter())}`,
    },
  });
};
