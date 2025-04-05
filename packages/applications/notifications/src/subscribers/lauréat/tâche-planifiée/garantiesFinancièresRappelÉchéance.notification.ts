import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { TâchePlanifiéeExecutéeEvent } from '@potentiel-domain/tache-planifiee';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerPorteursRecipients } from '../../../helpers/listerPorteursRecipients';
import { listerDrealsRecipients } from '../../../helpers/listerDrealsRecipients';

import { RegisterTâchePlanifiéeNotificationDependencies } from '.';

type GarantiesFinancièresRappelÉchéanceNotificationProps = {
  sendEmail: RegisterTâchePlanifiéeNotificationDependencies['sendEmail'];
  identifiantProjet: IdentifiantProjet.ValueType;
  event: TâchePlanifiéeExecutéeEvent;
  projet: {
    nom: string;
    département: string;
    région: string;
  };
  baseUrl: string;
};

export const garantiesFinancièresRappelÉchéanceNotification = async ({
  sendEmail,
  identifiantProjet,
  event,
  projet: { nom, région, département },
  baseUrl,
}: GarantiesFinancièresRappelÉchéanceNotificationProps) => {
  const porteurs = await listerPorteursRecipients(identifiantProjet);

  if (porteurs.length === 0) {
    getLogger().error('Aucun porteur trouvé', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'garantiesFinancièresRappelÉchéanceNotification',
    });
    return;
  }

  const dreals = await listerDrealsRecipients(région);

  if (dreals.length === 0) {
    getLogger().error('Aucune dreal trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'garantiesFinancièresRappelÉchéanceNotification',
    });
    return;
  }

  const nombreDeMois =
    event.payload.typeTâchePlanifiée === 'garanties-financières.rappel-échéance-un-mois'
      ? '1'
      : '2';

  await sendEmail({
    messageSubject: `Potentiel - Arrivée à échéance des garanties financières pour le projet ${nom} dans ${nombreDeMois} mois`,
    recipients: dreals,
    templateId: 6164034,
    variables: {
      nom_projet: nom,
      departement_projet: département,
      nombre_mois: nombreDeMois,
      url: `${baseUrl}${Routes.GarantiesFinancières.détail(identifiantProjet.formatter())}`,
    },
  });

  await sendEmail({
    messageSubject: `Potentiel - Arrivée à échéance de vos garanties financières pour le projet ${nom} arrivent à échéance dans ${nombreDeMois} mois`,
    recipients: porteurs,
    templateId: 6164049,
    variables: {
      nom_projet: nom,
      departement_projet: département,
      nombre_mois: nombreDeMois,
      url: `${baseUrl}${Routes.GarantiesFinancières.détail(identifiantProjet.formatter())}`,
    },
  });
};
