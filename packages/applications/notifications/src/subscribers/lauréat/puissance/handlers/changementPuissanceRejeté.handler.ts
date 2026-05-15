import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { buildUrl, getLauréat, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleChangementPuissanceRejeté = async ({
  payload,
}: Lauréat.Puissance.ChangementPuissanceRejetéEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);

  const porteurs = await listerPorteursRecipients(projet.identifiantProjet);

  return sendEmail({
    key: 'lauréat/puissance/demande/rejeter',
    recipients: porteurs,
    values: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      appel_offre: projet.identifiantProjet.appelOffre,
      période: projet.identifiantProjet.période,
      url: buildUrl(
        Routes.Puissance.changement.détailsPourRedirection(projet.identifiantProjet.formatter()),
      ),
    },
  });
};
