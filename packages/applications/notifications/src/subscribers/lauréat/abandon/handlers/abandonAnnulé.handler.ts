import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import {
  getBaseUrl,
  getLauréat,
  listerPorteursRecipients,
  listerRecipientsAutoritéInstructrice,
} from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleAbandonAnnulé = async ({ payload }: Lauréat.Abandon.AbandonAnnuléEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);
  const porteurs = await listerPorteursRecipients(projet.identifiantProjet);

  const adminRecipients = await listerRecipientsAutoritéInstructrice({
    identifiantProjet: projet.identifiantProjet,
    région: projet.région,
    domain: 'abandon',
  });

  const values = {
    nom_projet: projet.nom,
    departement_projet: projet.département,
    appel_offre: projet.identifiantProjet.appelOffre,
    période: projet.identifiantProjet.période,
    url: `${getBaseUrl()}${Routes.Abandon.détailRedirection(payload.identifiantProjet)}`,
  };

  await sendEmail({
    key: 'abandon/annuler',
    recipients: porteurs,
    values,
  });

  for (const recipient of adminRecipients) {
    await sendEmail({
      key: 'abandon/annuler',
      recipients: [recipient],
      values,
    });
  }
};
