import { Lauréat } from '@potentiel-domain/projet';

import { getLauréat, listerDrealsRecipients, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleChangementNomProjetEnregistré = async ({
  payload: { identifiantProjet, ancienNomProjet },
}: Lauréat.ChangementNomProjetEnregistréEvent) => {
  const projet = await getLauréat(identifiantProjet);

  const dreals = await listerDrealsRecipients(projet.région);
  const porteurs = await listerPorteursRecipients(projet.identifiantProjet);

  for (const recipients of [dreals, porteurs]) {
    await sendEmail({
      key: 'lauréat/nom-projet/enregistrer_changement',
      recipients,
      values: {
        ancien_nom_projet: ancienNomProjet,
        departement_projet: projet.département,
        appel_offre: projet.identifiantProjet.appelOffre,
        période: projet.identifiantProjet.période,
        url: projet.url,
      },
    });
  }
};
