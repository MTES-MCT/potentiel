import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getLauréat, listerDrealsRecipients } from '#helpers';
import { getBaseUrl } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleAttestationGarantiesFinancièresEnregistrée = async ({
  payload,
}: Lauréat.GarantiesFinancières.AttestationGarantiesFinancièresEnregistréeEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  await sendEmail({
    key: 'lauréat/garanties-financières/enregistrer_attestation',
    recipients: dreals,
    values: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      appel_offre: projet.identifiantProjet.appelOffre,
      période: projet.identifiantProjet.période,
      url: `${getBaseUrl()}${Routes.GarantiesFinancières.détail(projet.identifiantProjet.formatter())}`,
    },
  });
};
