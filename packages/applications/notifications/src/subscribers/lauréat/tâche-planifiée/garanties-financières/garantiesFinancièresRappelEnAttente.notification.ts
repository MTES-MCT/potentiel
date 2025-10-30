import { Routes } from '@potentiel-applications/routes';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerDrealsRecipients, listerPorteursRecipients } from '../../../../_helpers';

import { TâchePlanifiéeGarantiesFinancièresNotificationProps } from '.';

export const garantiesFinancièresRappelEnAttenteNotification = async ({
  sendEmail,
  identifiantProjet,
  projet: { nom, région, département },
  baseUrl,
}: TâchePlanifiéeGarantiesFinancièresNotificationProps) => {
  const porteurs = await listerPorteursRecipients(identifiantProjet);
  const dreals = await listerDrealsRecipients(région);

  const messageSubject = `Potentiel - Garanties financières en attente pour le projet ${nom} dans le département ${département}`;
  if (porteurs.length === 0) {
    getLogger().error('Aucun porteur trouvé', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'garantiesFinancièresRappelEnAttenteNotification',
    });
  } else {
    await sendEmail({
      messageSubject,
      recipients: porteurs,
      templateId: 7174524,
      variables: {
        nom_projet: nom,
        departement_projet: département,
        url: `${baseUrl}${Routes.GarantiesFinancières.dépôt.soumettre(identifiantProjet.formatter())}`,
      },
    });
  }

  if (dreals.length === 0) {
    getLogger().info('Aucune dreal trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'garantiesFinancièresRappelEnAttenteNotification',
    });
  } else {
    await sendEmail({
      messageSubject,
      recipients: dreals,
      templateId: 7174559,
      variables: {
        nom_projet: nom,
        departement_projet: département,
        url: `${baseUrl}${Routes.Projet.details(identifiantProjet.formatter())}`,
      },
    });
  }
};
