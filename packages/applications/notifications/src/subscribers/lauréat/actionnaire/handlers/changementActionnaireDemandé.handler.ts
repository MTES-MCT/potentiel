import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { getBaseUrl, getLauréat, listerDrealsRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleChangementActionnaireDemandé = async ({
  payload,
}: Lauréat.Actionnaire.ChangementActionnaireDemandéEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);
  const { appelOffre, période } = projet.identifiantProjet;

  const dreals = await listerDrealsRecipients(projet.région);

  return sendEmail({
    key: 'actionnaire/demande/demander',
    recipients: dreals,
    values: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      appel_offre: appelOffre,
      période,
      url: `${getBaseUrl()}${Routes.Actionnaire.changement.détails(projet.identifiantProjet.formatter(), payload.demandéLe)}`,
    },
  });
};
