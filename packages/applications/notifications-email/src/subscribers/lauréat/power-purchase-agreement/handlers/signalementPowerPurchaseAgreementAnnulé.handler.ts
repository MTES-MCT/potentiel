import { Routes } from '@potentiel-applications/routes';
import type { Lauréat } from '@potentiel-domain/projet';

import { buildUrl, getLauréat } from '#helpers';
import { sendEmail } from '#sendEmail';
import { getRecipients } from '../_helper/getRecipients.js';

export const handleSignalementPowerPurchaseAgreementAnnulé = async ({
  payload: { identifiantProjet, annuléPar },
}: Lauréat.PowerPurchaseAgreement.SignalementPowerPurchaseAgreementAnnuléEvent) => {
  const projet = await getLauréat(identifiantProjet);

  const recipients = await getRecipients(projet.identifiantProjet, annuléPar, projet.région);

  if (recipients) {
    for (const recipient of recipients) {
      await sendEmail({
        key: 'lauréat/power-purchase-agreement/annuler_signalement',
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
