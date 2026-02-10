import { Lauréat } from '@potentiel-domain/projet';

import { getLauréat, listerDrealsRecipients, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleÉvaluationCarboneSimplifiéeModifiée = async ({
  payload: { identifiantProjet },
}: Lauréat.Fournisseur.ÉvaluationCarboneModifiéeEvent) => {
  const projet = await getLauréat(identifiantProjet);

  const dreals = await listerDrealsRecipients(projet.région);
  const porteurs = await listerPorteursRecipients(projet.identifiantProjet);

  const values = {
    nom_projet: projet.nom,
    departement_projet: projet.département,
    url: projet.url,
    appel_offre: projet.identifiantProjet.appelOffre,
    période: projet.identifiantProjet.période,
  };

  await sendEmail({
    key: 'lauréat/fournisseur/modifier_évaluation_carbone',
    recipients: dreals,
    values,
  });

  await sendEmail({
    key: 'lauréat/fournisseur/modifier_évaluation_carbone',
    recipients: porteurs,
    values,
  });
};
