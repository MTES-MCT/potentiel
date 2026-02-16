import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { getBaseUrl, getLauréat, listerDrealsRecipients, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleChangementDispositifDeStockageEnregistré = async ({
  payload: { identifiantProjet, enregistréLe },
}: Lauréat.Installation.ChangementDispositifDeStockageEnregistréEvent) => {
  const projet = await getLauréat(identifiantProjet);

  const porteurs = await listerPorteursRecipients(projet.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  const values = {
    nom_projet: projet.nom,
    departement_projet: projet.département,
    url: `${getBaseUrl()}${Routes.Installation.changement.dispositifDeStockage.détails(projet.identifiantProjet.formatter(), enregistréLe)}`,
    appel_offre: projet.identifiantProjet.appelOffre,
    période: projet.identifiantProjet.période,
  };

  await sendEmail({
    key: 'lauréat/installation/dispositif-de-stockage/enregistrer_changement',
    recipients: porteurs,
    values,
  });

  await sendEmail({
    key: 'lauréat/installation/dispositif-de-stockage/enregistrer_changement',
    recipients: dreals,
    values,
  });
};
