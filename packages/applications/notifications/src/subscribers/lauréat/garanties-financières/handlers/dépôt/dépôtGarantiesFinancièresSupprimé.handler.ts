import { Lauréat } from '@potentiel-domain/projet';

import { getLauréat, listerDrealsRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleDépôtGarantiesFinancièresSupprimé = async ({
  payload,
}:
  | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursSuppriméEventV1
  | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursSuppriméEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);

  const dreals = await listerDrealsRecipients(projet.région);

  await sendEmail({
    key: 'lauréat/garanties-financières/dépôt/supprimer',
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
