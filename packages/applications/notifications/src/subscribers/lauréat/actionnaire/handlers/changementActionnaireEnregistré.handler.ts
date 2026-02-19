import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getBaseUrl, getLauréat, listerDrealsRecipients, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleChangementActionnaireEnregistré = async ({
  payload,
}: Lauréat.Actionnaire.ChangementActionnaireEnregistréEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);

  const dreals = await listerDrealsRecipients(projet.région);
  const porteurs = await listerPorteursRecipients(projet.identifiantProjet);

  for (const recipients of [dreals, porteurs]) {
    await sendEmail({
      key: 'lauréat/actionnaire/enregistrer_changement',
      recipients,
      values: {
        nom_projet: projet.nom,
        departement_projet: projet.département,
        appel_offre: projet.identifiantProjet.appelOffre,
        période: projet.identifiantProjet.période,
        url: `${getBaseUrl()}${Routes.Actionnaire.changement.détails(projet.identifiantProjet.formatter(), payload.enregistréLe)}`,
      },
    });
  }
};
