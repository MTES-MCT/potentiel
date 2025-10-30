import { match } from 'ts-pattern';

import { getLogger } from '@potentiel-libraries/monitoring';

import { listerDrealsRecipients, listerPorteursRecipients } from '../../../../_helpers';

import { TâchePlanifiéeAchèvementNotificationProps } from '.';

export const relanceÉchéanceAchèvementNotification = async ({
  sendEmail,
  identifiantProjet,
  projet: { nom, département, région, url },
  payload: { typeTâchePlanifiée },
}: TâchePlanifiéeAchèvementNotificationProps) => {
  const nombre_mois = match(typeTâchePlanifiée)
    .with('achèvement.rappel-échéance-un-mois', () => '1')
    .with('achèvement.rappel-échéance-deux-mois', () => '2')
    .with('achèvement.rappel-échéance-trois-mois', () => '3')
    .exhaustive();

  const porteurs = await listerPorteursRecipients(identifiantProjet);
  const dreals = await listerDrealsRecipients(région);

  if (dreals.length === 0 && porteurs.length === 0) {
    getLogger().error('Aucun porteur ou dreal trouvé', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'relanceÉchéanceAchèvementNotification',
    });
  } else {
    await sendEmail({
      messageSubject: `Potentiel - Projet ${nom} arrivant à échéance`,
      recipients: porteurs,
      templateId: 7207298,
      variables: {
        nom_projet: nom,
        departement_projet: département,
        url,
        nombre_mois,
      },
    });
    await sendEmail({
      messageSubject: `Potentiel - Projet ${nom} arrivant à échéance dans le département ${département}`,
      recipients: dreals,
      templateId: 7207229,
      variables: {
        nom_projet: nom,
        departement_projet: département,
        url,
        nombre_mois,
      },
    });
  }
};
