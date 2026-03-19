import { Accès } from '@potentiel-domain/projet';

import { getProjet, listerDrealsRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export async function handleAccèsProjetAutoriséSuiteÀRéclamation({
  payload: { identifiantProjet, identifiantUtilisateur },
}: Accès.AccèsProjetAutoriséEvent) {
  const projet = await getProjet(identifiantProjet);

  const drealRecipients = await listerDrealsRecipients(projet.région);

  const values = {
    nom_projet: projet.nom,
    departement_projet: projet.département,
    url: projet.url,
    appel_offre: projet.identifiantProjet.appelOffre,
    période: projet.identifiantProjet.période,
  };

  await sendEmail({
    key: 'accès/accès_autorisé_porteur',
    values,
    recipients: [identifiantUtilisateur],
  });

  await sendEmail({
    key: 'accès/accès_autorisé_dreal',
    values,
    recipients: drealRecipients,
  });
}
