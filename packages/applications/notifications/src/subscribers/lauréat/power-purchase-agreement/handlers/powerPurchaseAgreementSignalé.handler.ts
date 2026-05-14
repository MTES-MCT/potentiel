import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { buildUrl, getLauréat, listerDrealsRecipients, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handlePowerPurchaseAgreementSignalé = async ({
  payload: { identifiantProjet },
}: Lauréat.PowerPurchaseAgreement.PowerPurchaseAgreementSignaléEvent) => {
  const projet = await getLauréat(identifiantProjet);

  const dreals = await listerDrealsRecipients(projet.région);
  const porteurs = await listerPorteursRecipients(projet.identifiantProjet);

  for (const recipients of [dreals, porteurs]) {
    await sendEmail({
      key: 'lauréat/power-purchase-agreement/signaler',
      recipients,
      values: {
        nom_projet: projet.nom,
        departement_projet: projet.département,
        url: buildUrl(Routes.Lauréat.détails.tableauDeBord(projet.identifiantProjet.formatter())),
        appel_offre: projet.identifiantProjet.appelOffre,
        période: projet.identifiantProjet.période,
      },
    });
  }
};
