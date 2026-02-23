import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getBaseUrl, getLauréat, listerDrealsRecipients, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleChangementFournisseurEnregistré = async ({
  payload: { identifiantProjet, enregistréLe },
}: Lauréat.Fournisseur.ChangementFournisseurEnregistréEvent) => {
  const projet = await getLauréat(identifiantProjet);

  const dreals = await listerDrealsRecipients(projet.région);
  const porteurs = await listerPorteursRecipients(projet.identifiantProjet);

  const values = {
    nom_projet: projet.nom,
    departement_projet: projet.département,
    url: `${getBaseUrl()}${Routes.Fournisseur.changement.détails(projet.identifiantProjet.formatter(), enregistréLe)}`,
    appel_offre: projet.identifiantProjet.appelOffre,
    période: projet.identifiantProjet.période,
  };

  await sendEmail({
    key: 'lauréat/fournisseur/enregistrer_changement',
    recipients: dreals,
    values,
  });

  await sendEmail({
    key: 'lauréat/fournisseur/enregistrer_changement',
    recipients: porteurs,
    values,
  });
};
