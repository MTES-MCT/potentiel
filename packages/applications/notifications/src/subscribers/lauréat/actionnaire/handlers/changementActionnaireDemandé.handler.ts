import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { getBaseUrl, getLauréat, listerDrealsRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleChangementActionnaireDemandé = async ({
  payload,
}: Lauréat.Actionnaire.ChangementActionnaireDemandéEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);

  const dreals = await listerDrealsRecipients(projet.région);

  return sendEmail({
    key: 'lauréat/actionnaire/demande/demander',
    recipients: dreals,
    values: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      appel_offre: projet.identifiantProjet.appelOffre,
      période: projet.identifiantProjet.période,
      url: `${getBaseUrl()}${Routes.Actionnaire.changement.détails(projet.identifiantProjet.formatter(), payload.demandéLe)}`,
    },
  });
};
