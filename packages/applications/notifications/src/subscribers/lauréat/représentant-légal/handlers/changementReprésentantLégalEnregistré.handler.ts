import { Routes } from '@potentiel-applications/routes';
import type { Lauréat } from '@potentiel-domain/projet';

import { buildUrl, getLauréat, listerDrealsRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleChangementReprésentantLégalCorrigé = async ({
  payload,
}: Lauréat.ReprésentantLégal.ChangementReprésentantLégalCorrigéEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);

  const dreals = await listerDrealsRecipients(projet.région);

  await sendEmail({
    key: 'lauréat/représentant-légal/demande/corriger',
    recipients: dreals,
    values: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      appel_offre: projet.identifiantProjet.appelOffre,
      période: projet.identifiantProjet.période,
      url: buildUrl(
        Routes.ReprésentantLégal.changement.détailsPourRedirection(
          projet.identifiantProjet.formatter(),
        ),
      ),
    },
  });
};
