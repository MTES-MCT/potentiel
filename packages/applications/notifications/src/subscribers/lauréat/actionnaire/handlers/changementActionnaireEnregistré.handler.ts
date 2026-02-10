import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getBaseUrl, getLauréat, listerDrealsRecipients, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleChangementActionnaireEnregistré = async ({
  payload,
}: Lauréat.Actionnaire.ChangementActionnaireEnregistréEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);
  const { appelOffre, période } = projet.identifiantProjet;

  const dreals = await listerDrealsRecipients(projet.région);
  const porteurs = await listerPorteursRecipients(projet.identifiantProjet);

  for (const recipients of [dreals, porteurs]) {
    await sendEmail({
      key: 'actionnaire/enregistrer_changement',
      recipients,
      values: {
        nom_projet: projet.nom,
        departement_projet: projet.département,
        appel_offre: appelOffre,
        période,
        url: `${getBaseUrl()}${Routes.Lauréat.détails.tableauDeBord(projet.identifiantProjet.formatter())}`,
      },
    });
  }
};
