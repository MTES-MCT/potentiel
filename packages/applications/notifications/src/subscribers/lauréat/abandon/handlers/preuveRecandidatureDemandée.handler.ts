import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getBaseUrl, getLauréat, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handlePreuveRecandidatureDemandée = async ({
  payload,
}: Lauréat.Abandon.PreuveRecandidatureDemandéeEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);
  const { appelOffre, période } = projet.identifiantProjet;
  const porteurs = await listerPorteursRecipients(projet.identifiantProjet);

  await sendEmail({
    key: 'abandon/demanderPreuveRecandidature',
    recipients: porteurs,
    values: {
      nom_projet: projet.nom,
      appelOffre,
      période,
      url: `${getBaseUrl()}${Routes.Abandon.détailRedirection(projet.identifiantProjet.formatter())}/`,
    },
  });
};
