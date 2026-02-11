import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getBaseUrl, getLauréat, listerDrealsRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleChangementActionnaireAnnulé = async ({
  payload,
}: Lauréat.Actionnaire.ChangementActionnaireAnnuléEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  return sendEmail({
    key: 'lauréat/actionnaire/demande/annuler',
    recipients: dreals,
    values: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      appel_offre: projet.identifiantProjet.appelOffre,
      période: projet.identifiantProjet.période,
      url: `${getBaseUrl()}${Routes.Actionnaire.changement.détailsPourRedirection(projet.identifiantProjet.formatter())}`,
    },
  });
};
