import { Période } from '@potentiel-domain/periode';
import { Role } from '@potentiel-domain/utilisateur';

import { getBaseUrl } from '#helpers';
import { sendEmail } from '#sendEmail';
import { listerRecipients } from '#helpers';

export const handlePériodeNotifiée = async ({
  payload: { identifiantPériode, notifiéeLe },
}: Période.PériodeNotifiéeEvent) => {
  const identifiantPériodeValueType =
    Période.IdentifiantPériode.convertirEnValueType(identifiantPériode);

  const utilisateursAutresQuePorteurs = await listerRecipients({
    roles: [
      Role.admin.nom,
      Role.dreal.nom,
      Role.cocontractant.nom,
      Role.ademe.nom,
      Role.caisseDesDépôts.nom,
      Role.cre.nom,
      Role.dgecValidateur.nom,
    ],
  });

  for (const email of utilisateursAutresQuePorteurs) {
    await sendEmail({
      key: 'période/notifier',
      recipients: [email],
      values: {
        appel_offre: identifiantPériodeValueType.appelOffre,
        période: identifiantPériodeValueType.période,
        date_notification: new Date(notifiéeLe).toLocaleDateString('fr-FR'),
        url: getBaseUrl(),
      },
    });
  }
};
