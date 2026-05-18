import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { buildUrl, getLauréat, listerDrealsRecipients, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleTypologieInstallationModifiée = async ({
  payload: { identifiantProjet },
}: Lauréat.Installation.TypologieInstallationModifiéeEvent) => {
  const projet = await getLauréat(identifiantProjet);

  const dreals = await listerDrealsRecipients(projet.région);
  const porteurs = await listerPorteursRecipients(projet.identifiantProjet);

  const values = {
    nom_projet: projet.nom,
    departement_projet: projet.département,
    appel_offre: projet.identifiantProjet.appelOffre,
    période: projet.identifiantProjet.période,
    url: buildUrl(Routes.Lauréat.détails.installation(projet.identifiantProjet.formatter())),
  };

  await sendEmail({
    key: 'lauréat/installation/typologie-installation/modifier',
    recipients: porteurs,
    values,
  });

  await sendEmail({
    key: 'lauréat/installation/typologie-installation/modifier',
    recipients: dreals,
    values,
  });
};
