import { Routes } from '@potentiel-applications/routes';
import type { Lauréat } from '@potentiel-domain/projet';

import { buildUrl, getLauréat } from '#helpers';
import { sendEmail } from '#sendEmail';
import { getRecipients } from '../_helper/getRecipients.js';

export const handlePowerPurchaseAgreementSignalé = async ({
  payload: { identifiantProjet, signaléPar },
}: Lauréat.PowerPurchaseAgreement.PowerPurchaseAgreementSignaléEvent) => {
  const projet = await getLauréat(identifiantProjet);

  const recipients = await getRecipients(projet.identifiantProjet, signaléPar, projet.région);

  if (recipients) {
    for (const recipient of recipients) {
      await sendEmail({
        key: 'lauréat/power-purchase-agreement/signaler',
        recipients: recipient,
        values: {
          nom_projet: projet.nom,
          departement_projet: projet.département,
          url: buildUrl(Routes.Lauréat.détails.tableauDeBord(projet.identifiantProjet.formatter())),
          appel_offre: projet.identifiantProjet.appelOffre,
          période: projet.identifiantProjet.période,
        },
      });
    }
  }
};
