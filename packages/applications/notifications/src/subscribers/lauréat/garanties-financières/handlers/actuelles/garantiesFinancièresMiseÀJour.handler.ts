import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getLauréat, getBaseUrl, listerDrealsRecipients, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleGarantiesFinancièresMiseÀJour = async ({
  payload,
}:
  | Lauréat.GarantiesFinancières.GarantiesFinancièresModifiéesEvent
  | Lauréat.GarantiesFinancières.GarantiesFinancièresEnregistréesEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);
  const porteurs = await listerPorteursRecipients(projet.identifiantProjet);

  const values = {
    nom_projet: projet.nom,
    departement_projet: projet.département,
    appel_offre: projet.identifiantProjet.appelOffre,
    période: projet.identifiantProjet.période,
    url: `${getBaseUrl()}${Routes.GarantiesFinancières.détail(projet.identifiantProjet.formatter())}`,
  };

  await sendEmail({
    key: 'lauréat/garanties-financières/mettre_à_jour',
    recipients: dreals,
    values,
  });

  await sendEmail({
    key: 'lauréat/garanties-financières/mettre_à_jour',
    recipients: porteurs,
    values,
  });
};
