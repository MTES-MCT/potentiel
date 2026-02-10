import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { getBaseUrl, getLauréat, listerDrealsRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleChangementProducteurEnregistré = async ({
  payload: { identifiantProjet, enregistréLe },
}: Lauréat.Producteur.ChangementProducteurEnregistréEvent) => {
  const projet = await getLauréat(identifiantProjet);

  const dreals = await listerDrealsRecipients(projet.région);

  await sendEmail({
    key: 'lauréat/producteur/enregistrer_changement',
    recipients: dreals,
    values: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${getBaseUrl()}${Routes.Producteur.changement.détails(projet.identifiantProjet.formatter(), enregistréLe)}`,
      appel_offre: projet.identifiantProjet.appelOffre,
      période: projet.identifiantProjet.période,
    },
  });
};
