import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getBaseUrl, getLauréat, listerDrealsRecipients, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleActionnaireModifié = async ({
  payload,
}: Lauréat.Actionnaire.ActionnaireModifiéEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);

  const porteurs = await listerPorteursRecipients(projet.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  for (const recipients of [dreals, porteurs]) {
    await sendEmail({
      key: 'actionnaire/modifier',
      recipients,
      values: {
        nom_projet: projet.nom,
        departement_projet: projet.département,
        appel_offre: projet.identifiantProjet.appelOffre,
        période: projet.identifiantProjet.période,
        url: `${getBaseUrl()}${Routes.Lauréat.détails.tableauDeBord(projet.identifiantProjet.formatter())}`,
      },
    });
  }
};
