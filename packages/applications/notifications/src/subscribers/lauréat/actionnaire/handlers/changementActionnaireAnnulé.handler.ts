import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getBaseUrl, getLauréat, listerDrealsRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

import { getDateDernièreDemandeActionnaire } from '../helpers/getDateDemandeClôturéeActionnaire.js';

export const handleChangementActionnaireAnnulé = async ({
  payload,
}: Lauréat.Actionnaire.ChangementActionnaireAnnuléEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);
  const { appelOffre, période } = projet.identifiantProjet;
  const dreals = await listerDrealsRecipients(projet.région);

  const demandéLe = await getDateDernièreDemandeActionnaire(projet.identifiantProjet.formatter());

  return sendEmail({
    key: 'actionnaire/demande/annuler',
    recipients: dreals,
    values: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      appel_offre: appelOffre,
      période,
      url: `${getBaseUrl()}${Routes.Actionnaire.changement.détails(projet.identifiantProjet.formatter(), demandéLe)}`,
    },
  });
};
