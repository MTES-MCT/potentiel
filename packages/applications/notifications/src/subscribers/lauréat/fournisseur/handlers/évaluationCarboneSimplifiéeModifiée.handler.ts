import { Lauréat } from '@potentiel-domain/projet';

import { getLauréat, listerDrealsRecipients, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleÉvaluationCarboneSimplifiéeModifiée = async ({
  payload: { identifiantProjet },
}: Lauréat.Fournisseur.ÉvaluationCarboneModifiéeEvent) => {
  const projet = await getLauréat(identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);
  const porteurs = await listerPorteursRecipients(projet.identifiantProjet);

  await sendEmail({
    key: 'lauréat/fournisseur/modifierÉvaluationCarbone',
    recipients: dreals,
    values: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });

  await sendEmail({
    key: 'lauréat/fournisseur/modifierÉvaluationCarbone',
    recipients: porteurs,
    values: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });
};
