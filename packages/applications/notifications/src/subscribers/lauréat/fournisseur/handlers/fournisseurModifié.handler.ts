import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { buildUrl, getLauréat, listerDrealsRecipients, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleFournisseurModifié = async ({
  payload: { identifiantProjet },
}: Lauréat.Fournisseur.FournisseurModifiéEvent) => {
  const projet = await getLauréat(identifiantProjet);

  const porteurs = await listerPorteursRecipients(projet.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  const values = {
    nom_projet: projet.nom,
    departement_projet: projet.département,
    appel_offre: projet.identifiantProjet.appelOffre,
    période: projet.identifiantProjet.période,
    url: buildUrl(Routes.Lauréat.détails.évaluationCarbone(projet.identifiantProjet.formatter())),
  };

  await sendEmail({
    key: 'lauréat/fournisseur/modifier',
    recipients: dreals,
    values,
  });

  await sendEmail({
    key: 'lauréat/fournisseur/modifier',
    recipients: porteurs,
    values,
  });
};
