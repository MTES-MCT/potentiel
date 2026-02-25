import { Accès } from '@potentiel-domain/projet';

import { getProjet, listerDrealsRecipients, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export async function handleAccèsProjetAutoriséSuiteÀRéclamation({
  payload: { identifiantProjet },
}: Accès.AccèsProjetAutoriséEvent) {
  const projet = await getProjet(identifiantProjet);

  const porteursRecipients = await listerPorteursRecipients(projet.identifiantProjet);
  const drealRecipients = await listerDrealsRecipients(projet.région);

  const values = {
    nom_projet: projet.nom,
    departement_projet: projet.département,
    url: projet.url,
    appel_offre: projet.identifiantProjet.appelOffre,
    période: projet.identifiantProjet.période,
  };

  await sendEmail({
    key: 'accès/accès_projet_suite_à_réclamation_pour_porteur',
    values,
    recipients: porteursRecipients,
  });

  await sendEmail({
    key: 'accès/accès_projet_suite_à_réclamation_pour_dreal',
    values,
    recipients: drealRecipients,
  });
}
