import { Routes } from '@potentiel-applications/routes';
import { Éliminé } from '@potentiel-domain/projet';

import { buildUrl, getÉliminé, listerDgecRecipients, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleRecoursAnnulé = async ({ payload }: Éliminé.Recours.RecoursAnnuléEvent) => {
  const projet = await getÉliminé(payload.identifiantProjet);
  const { appelOffre, période } = projet.identifiantProjet;
  const porteursRecipients = await listerPorteursRecipients(projet.identifiantProjet);
  const dgecRecipients = await listerDgecRecipients(projet.identifiantProjet);

  for (const recipients of [porteursRecipients, dgecRecipients]) {
    await sendEmail({
      key: 'recours/annuler',
      recipients,
      values: {
        nom_projet: projet.nom,
        departement_projet: projet.département,
        appelOffre,
        période,
        url: buildUrl(Routes.Recours.détailPourRedirection(payload.identifiantProjet)),
      },
    });
  }
};
