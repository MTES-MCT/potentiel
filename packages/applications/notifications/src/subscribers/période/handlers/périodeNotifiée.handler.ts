import { Période } from '@potentiel-domain/periode';
import { Role } from '@potentiel-domain/utilisateur';

import { getBaseUrl, listerCocontractantRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';
import { listerRecipients } from '#helpers';

// viovio
export const handlePériodeNotifiée = async ({
  payload: { identifiantPériode, notifiéeLe, zonesLauréatEtÉliminés },
}: Période.PériodeNotifiéeEvent) => {
  const identifiantPériodeValueType =
    Période.IdentifiantPériode.convertirEnValueType(identifiantPériode);

  const utilisateursAutresQuePorteurs = await listerRecipients({
    roles: [
      Role.admin.nom,
      Role.dreal.nom,
      Role.ademe.nom,
      Role.caisseDesDépôts.nom,
      Role.cre.nom,
      Role.dgecValidateur.nom,
    ],
  });

  // si aucune zone n'est spécifiée, on envoie à tous les cocontractants
  const cocontractantRecipients = zonesLauréatEtÉliminés
    ? await listerCocontractantRecipients(zonesLauréatEtÉliminés)
    : await listerRecipients({
        roles: [Role.cocontractant.nom],
      });

  for (const email of [...utilisateursAutresQuePorteurs, ...cocontractantRecipients]) {
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
