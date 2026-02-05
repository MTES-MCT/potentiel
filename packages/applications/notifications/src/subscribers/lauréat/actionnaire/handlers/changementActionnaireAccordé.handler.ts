import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getBaseUrl, getLauréat, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

import { getDateDemandeEnCoursActionnaire } from '../helpers/getDateDemandeEnCoursActionnaire.js';

export const handleChangementActionnaireAccordé = async ({
  payload,
}: Lauréat.Actionnaire.ChangementActionnaireAccordéEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);
  const { appelOffre, période } = projet.identifiantProjet;

  const porteurs = await listerPorteursRecipients(projet.identifiantProjet);

  const demandéLe = await getDateDemandeEnCoursActionnaire(projet.identifiantProjet.formatter());

  return sendEmail({
    key: 'actionnaire/demande/accorder',
    recipients: porteurs,
    values: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      appel_offre: appelOffre,
      période,
      url: `${getBaseUrl()}${Routes.Actionnaire.changement.détails(projet.identifiantProjet.formatter(), demandéLe)}`,
    },
  });
};
