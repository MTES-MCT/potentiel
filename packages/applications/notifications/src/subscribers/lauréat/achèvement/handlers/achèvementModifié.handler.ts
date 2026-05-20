import type { Lauréat } from '@potentiel-domain/projet';

import { getLauréat, listerDrealsRecipients, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleAchèvementModifié = async ({
  payload: { identifiantProjet },
}: Lauréat.Achèvement.AchèvementModifiéEvent | Lauréat.Achèvement.AchèvementModifiéEventV1) => {
  const projet = await getLauréat(identifiantProjet);

  const dreals = await listerDrealsRecipients(projet.région);
  const porteurs = await listerPorteursRecipients(projet.identifiantProjet);

  const values = {
    nom_projet: projet.nom,
    departement_projet: projet.département,
    appel_offre: projet.identifiantProjet.appelOffre,
    période: projet.identifiantProjet.période,
    url: projet.url,
  };

  await sendEmail({
    key: 'lauréat/achèvement/modifier',
    recipients: porteurs,
    values,
  });

  await sendEmail({
    key: 'lauréat/achèvement/modifier',
    recipients: dreals,
    values,
  });
};
