import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { buildUrl, getLauréat, listerDrealsRecipients, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleSiteDeProductionModifié = async ({
  payload: {
    identifiantProjet,
    localité: { région },
  },
}: Lauréat.SiteDeProductionModifiéEvent) => {
  const projet = await getLauréat(identifiantProjet);

  const dreals = await listerDrealsRecipients(région);
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

  for (const recipients of [dreals, porteurs]) {
    await sendEmail({
      key: 'lauréat/site-de-production/modifier',
      recipients,
      values,
    });
  }
};
