import { match } from 'ts-pattern';

import { listerPorteursRecipients, listerDrealsRecipients, getLauréat } from '#helpers';
import { sendEmail } from '#sendEmail';

import { TâchePlanifiéeAchèvementNotificationProps } from '../tâche-planifiée.achèvement.notifications.js';

export const handleRelanceÉchéanceAchèvement = async ({
  identifiantProjet,
  payload: { typeTâchePlanifiée },
}: TâchePlanifiéeAchèvementNotificationProps) => {
  const lauréat = await getLauréat(identifiantProjet.formatter());

  const nombre_mois = match(typeTâchePlanifiée)
    .with('achèvement.rappel-échéance-un-mois', () => '1')
    .with('achèvement.rappel-échéance-deux-mois', () => '2')
    .with('achèvement.rappel-échéance-trois-mois', () => '3')
    .exhaustive();

  const porteursRecipients = await listerPorteursRecipients(identifiantProjet);

  const values = {
    nom_projet: lauréat.nom,
    appel_offre: lauréat.identifiantProjet.appelOffre,
    période: lauréat.identifiantProjet.période,
    departement_projet: lauréat.département,
    nombre_mois,
    url: lauréat.url,
  };

  await sendEmail({
    key: 'lauréat/achèvement/rappel_échéance_porteur',
    recipients: porteursRecipients,
    values,
  });

  // Les DREALS sont notifiés uniquement pour le rappel à un mois
  if (typeTâchePlanifiée === 'achèvement.rappel-échéance-un-mois') {
    const drealsRecipients = await listerDrealsRecipients(lauréat.région);

    await sendEmail({
      key: 'lauréat/achèvement/rappel_échéance_dreal',
      recipients: drealsRecipients,
      values,
    });
  }
};
