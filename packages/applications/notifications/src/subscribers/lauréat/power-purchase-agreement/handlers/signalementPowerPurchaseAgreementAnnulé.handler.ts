import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { getBaseUrl, getLauréat, listerDrealsRecipients, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleSignalementPowerPurchaseAgreementAnnulé = async ({
  payload: { identifiantProjet },
}: Lauréat.PowerPurchaseAgreement.PowerPurchaseAgreementAnnuléEvent) => {
  const projet = await getLauréat(identifiantProjet);

  const dreals = await listerDrealsRecipients(projet.région);
  const porteurs = await listerPorteursRecipients(projet.identifiantProjet);

  for (const recipients of [dreals, porteurs]) {
    await sendEmail({
      key: 'lauréat/power-purchase-agreement/annuler_signalement',
      recipients,
      values: {
        nom_projet: projet.nom,
        departement_projet: projet.département,
        url: `${getBaseUrl()}${Routes.Lauréat.détails.tableauDeBord(projet.identifiantProjet.formatter())}`,
        appel_offre: projet.identifiantProjet.appelOffre,
        période: projet.identifiantProjet.période,
      },
    });
  }
};
