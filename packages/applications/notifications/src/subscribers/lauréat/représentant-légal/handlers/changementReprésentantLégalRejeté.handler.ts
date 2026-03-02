import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getBaseUrl, getLauréat, listerDrealsRecipients, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleChangementReprésentantLégalRejeté = async ({
  payload,
}: Lauréat.ReprésentantLégal.ChangementReprésentantLégalRejetéEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);

  const porteurs = await listerPorteursRecipients(projet.identifiantProjet);
  const values = {
    nom_projet: projet.nom,
    departement_projet: projet.département,
    appel_offre: projet.identifiantProjet.appelOffre,
    période: projet.identifiantProjet.période,
    url: `${getBaseUrl()}${Routes.ReprésentantLégal.changement.détailsPourRedirection(projet.identifiantProjet.formatter())}`,
  };

  if (payload.rejetAutomatique) {
    const dreals = await listerDrealsRecipients(projet.région);

    for (const recipients of [porteurs, dreals]) {
      return sendEmail({
        key: 'lauréat/représentant-légal/demande/rejeter_automatiquement',
        recipients,
        values,
      });
    }
  }

  return sendEmail({
    key: 'lauréat/représentant-légal/demande/rejeter',
    recipients: porteurs,
    values,
  });
};
