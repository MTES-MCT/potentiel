import { Lauréat } from '@potentiel-domain/projet';

import { getLauréat, listerDrealsRecipients, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleReprésentantLégalModifié = async ({
  payload,
}: Lauréat.ReprésentantLégal.ReprésentantLégalModifiéEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);

  const porteurs = await listerPorteursRecipients(projet.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  for (const recipients of [dreals, porteurs]) {
    await sendEmail({
      key: 'lauréat/représentant-légal/modifier',
      recipients,
      values: {
        nom_projet: projet.nom,
        departement_projet: projet.département,
        appel_offre: projet.identifiantProjet.appelOffre,
        période: projet.identifiantProjet.période,
        url: projet.url,
      },
    });
  }
};
