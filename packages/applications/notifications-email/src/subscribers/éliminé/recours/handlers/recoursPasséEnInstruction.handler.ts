import { Routes } from '@potentiel-applications/routes';
import type { Éliminé } from '@potentiel-domain/projet';

import { buildUrl, getÉliminé, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleRecoursPasséEnInstruction = async ({
  payload,
}: Éliminé.Recours.RecoursPasséEnInstructionEvent) => {
  const projet = await getÉliminé(payload.identifiantProjet);
  const { appelOffre, période } = projet.identifiantProjet;
  const porteursRecipients = await listerPorteursRecipients(projet.identifiantProjet);

  await sendEmail({
    key: 'recours/passer_en_instruction',
    recipients: porteursRecipients,
    values: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      appelOffre,
      période,
      url: buildUrl(Routes.Recours.détailPourRedirection(payload.identifiantProjet)),
    },
  });
};
