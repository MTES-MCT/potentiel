import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { getLogger } from '@potentiel-libraries/monitoring';

import { GarantiesFinancièresNotificationsProps } from '../../type';
import { listerPorteursRecipients } from '../../../../../_helpers';
import { garantiesFinancièresNotificationTemplateId } from '../../constant';

export const handleDépôtGarantiesFinancièresValidé = async ({
  event,
  sendEmail,
  projet,
  baseUrl,
}: GarantiesFinancièresNotificationsProps<
  | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursValidéEventV1
  | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursValidéEvent
>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteurs = await listerPorteursRecipients(identifiantProjet);

  if (porteurs.length === 0) {
    getLogger().error('Aucun porteur trouvé', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
    });
    return;
  }

  await sendEmail({
    templateId: garantiesFinancièresNotificationTemplateId.dépôt.validéPourPorteur,
    messageSubject: `Potentiel - Des garanties financières sont validées pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: porteurs,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      region_projet: projet.région,
      nouveau_statut: 'validées',
      url: `${baseUrl}${Routes.GarantiesFinancières.détail(identifiantProjet.formatter())}`,
    },
  });
};
