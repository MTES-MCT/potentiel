import { Lauréat } from '@potentiel-domain/projet';

import { listerDrealsRecipients } from '#helpers';
import { getLauréat } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleDemandeMainlevéeAnnulée = async ({
  payload,
}: Lauréat.GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresAnnuléeEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  await sendEmail({
    key: 'lauréat/garanties-financières/mainlevée/annuler',
    recipients: dreals,
    values: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      appel_offre: projet.identifiantProjet.appelOffre,
      période: projet.identifiantProjet.période,
      url: projet.url,
    },
  });
};
