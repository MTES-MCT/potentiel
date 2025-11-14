import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerDrealsRecipients } from '@/helpers';

import { GarantiesFinancièresNotificationsProps } from '../../type.js';
import { garantiesFinancièresNotificationTemplateId } from '../../constant.js';

export const handleMainlevéeDemandée = async ({
  event,
  sendEmail,
  projet,
  baseUrl,
}: GarantiesFinancièresNotificationsProps<Lauréat.GarantiesFinancières.MainlevéeGarantiesFinancièresDemandéeEvent>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  if (dreals.length === 0) {
    getLogger().info('Aucune dreal trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
    });
    return;
  }

  await sendEmail({
    templateId: garantiesFinancièresNotificationTemplateId.mainlevée.demandéePourDreal,
    messageSubject: `Potentiel - Demande de mainlevée des garanties financières pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: dreals,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      region_projet: projet.région,
      url: `${baseUrl}${Routes.GarantiesFinancières.détail(identifiantProjet.formatter())}`,
    },
  });
};
