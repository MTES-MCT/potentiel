import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getBaseUrl, getLauréat, listerDrealsRecipients, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleChangementReprésentantLégalAccordé = async ({
  payload,
}: Lauréat.ReprésentantLégal.ChangementReprésentantLégalAccordéEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);

  const porteurs = await listerPorteursRecipients(projet.identifiantProjet);

  const values = {
    nom_projet: projet.nom,
    departement_projet: projet.département,
    appel_offre: projet.identifiantProjet.appelOffre,
    période: projet.identifiantProjet.période,
    url: `${getBaseUrl()}${Routes.ReprésentantLégal.changement.détailsPourRedirection(projet.identifiantProjet.formatter())}`,
  };

  if (payload.avecCorrection) {
    return sendEmail({
      key: 'lauréat/représentant-légal/demande/accorder_avec_correction',
      recipients: porteurs,
      values,
    });
  }

  if (!payload.accordAutomatique) {
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
  }

  const dreals = await listerDrealsRecipients(projet.région);

  for (const recipients of [porteurs, dreals]) {
    await sendEmail({
      key: 'lauréat/représentant-légal/demande/accorder_automatiquement',
      recipients,
      values,
    });
  }
};
