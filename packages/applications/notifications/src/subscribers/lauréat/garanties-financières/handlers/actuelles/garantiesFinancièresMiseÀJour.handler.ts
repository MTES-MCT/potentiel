import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { getLogger } from '@potentiel-libraries/monitoring';

import { GarantiesFinancièresNotificationsProps } from '../../type';
import { listerDrealsRecipients, listerPorteursRecipients } from '../../../../../_helpers';
import { garantiesFinancièresNotificationTemplateId } from '../../constant';

export const handleGarantiesFinancièresMiseÀJour = async ({
  event,
  sendEmail,
  projet,
  baseUrl,
}: GarantiesFinancièresNotificationsProps<
  | Lauréat.GarantiesFinancières.GarantiesFinancièresModifiéesEvent
  | Lauréat.GarantiesFinancières.GarantiesFinancièresEnregistréesEvent
>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);
  const porteurs = await listerPorteursRecipients(identifiantProjet);

  const messageSubject = `Potentiel - Garanties financières mises à jour pour le projet ${projet.nom} dans le département ${projet.département}`;
  const variables = {
    nom_projet: projet.nom,
    departement_projet: projet.département,
    region_projet: projet.région,
    url: `${baseUrl}${Routes.GarantiesFinancières.détail(identifiantProjet.formatter())}`,
  };

  if (dreals.length === 0) {
    getLogger().info('Aucune dreal trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
    });
    return;
  }

  await sendEmail({
    templateId: garantiesFinancièresNotificationTemplateId.actuelles.miseÀJourPourDreal,
    messageSubject,
    recipients: dreals,
    variables,
  });

  if (porteurs.length === 0) {
    getLogger().error('Aucun porteur trouvé', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
    });
    return;
  }

  await sendEmail({
    templateId: garantiesFinancièresNotificationTemplateId.actuelles.miseÀJourPourDreal,
    messageSubject,
    recipients: porteurs,
    variables,
  });
};
