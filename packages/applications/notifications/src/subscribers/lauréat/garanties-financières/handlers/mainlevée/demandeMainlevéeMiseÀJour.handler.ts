import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { listerPorteursRecipients } from '#helpers';
import { getBaseUrl } from '#helpers';
import { getLauréat } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleDemandeMainlevéeMiseÀJour = async ({
  payload,
}:
  | Lauréat.GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresAccordéeEvent
  | Lauréat.GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresRejetéeEvent
  | Lauréat.GarantiesFinancières.InstructionDemandeMainlevéeGarantiesFinancièresDémarréeEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);
  const porteurs = await listerPorteursRecipients(projet.identifiantProjet);

  await sendEmail({
    key: 'lauréat/garanties-financières/mainlevée/statut_modifié',
    recipients: porteurs,
    values: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      appel_offre: projet.identifiantProjet.appelOffre,
      période: projet.identifiantProjet.période,
      url: `${getBaseUrl()}${Routes.GarantiesFinancières.détail(projet.identifiantProjet.formatter())}`,
    },
  });
};
