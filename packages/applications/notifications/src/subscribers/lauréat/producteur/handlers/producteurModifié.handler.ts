import { Routes } from '@potentiel-applications/routes';
import type { Lauréat } from '@potentiel-domain/projet';

import { buildUrl, getLauréat, listerDrealsRecipients, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '../../../../sendEmail.js';

export const handleProducteurModifié = async ({
  payload: { identifiantProjet },
}: Lauréat.Producteur.ProducteurModifiéEvent) => {
  const projet = await getLauréat(identifiantProjet);

  const dreals = await listerDrealsRecipients(projet.région);
  const porteurs = await listerPorteursRecipients(projet.identifiantProjet);

  const values = {
    nom_projet: projet.nom,
    departement_projet: projet.département,
    appel_offre: projet.identifiantProjet.appelOffre,
    période: projet.identifiantProjet.période,
    url: buildUrl(
      Routes.Lauréat.détails.informationGénérales(projet.identifiantProjet.formatter()),
    ),
  };

  await sendEmail({
    key: 'lauréat/producteur/modifier',
    recipients: porteurs,
    values,
  });

  await sendEmail({
    key: 'lauréat/producteur/modifier',
    recipients: dreals,
    values,
  });
};
