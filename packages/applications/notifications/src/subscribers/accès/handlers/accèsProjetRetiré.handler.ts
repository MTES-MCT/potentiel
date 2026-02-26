import { Routes } from '@potentiel-applications/routes';
import { Accès } from '@potentiel-domain/projet';

import { getBaseUrl, getProjet } from '#helpers';
import { sendEmail } from '#sendEmail';

export async function handleAccèsProjetRetiré({ payload }: Accès.AccèsProjetRetiréEvent) {
  const projet = await getProjet(payload.identifiantProjet);

  return sendEmail({
    key: 'accès/accès_révoqué',
    values: {
      nom_projet: projet.nom,
      appel_offre: projet.identifiantProjet.appelOffre,
      période: projet.identifiantProjet.période,
      departement_projet: projet.département,
      cause:
        payload.cause === 'changement-producteur'
          ? 'Cela fait suite à un changement de producteur déclaré sur Potentiel.'
          : '',
      url: `${getBaseUrl()}${Routes.Lauréat.lister()}`,
    },
    recipients: payload.identifiantsUtilisateur,
  });
}
