import { Éliminé } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getBaseUrl, getÉliminé, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleRecoursPasséEnInstruction = async ({
  payload,
}: Éliminé.Recours.RecoursPasséEnInstructionEvent) => {
  const projet = await getÉliminé(payload.identifiantProjet);
  const { appelOffre, période } = projet.identifiantProjet;
  const porteursRecipients = await listerPorteursRecipients(projet.identifiantProjet);

  await sendEmail({
    key: 'recours/passerEnInstruction',
    recipients: porteursRecipients,
    values: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      appelOffre,
      période,
      url: `${getBaseUrl()}${Routes.Recours.détailPourRedirection(payload.identifiantProjet)}`,
    },
  });
};
