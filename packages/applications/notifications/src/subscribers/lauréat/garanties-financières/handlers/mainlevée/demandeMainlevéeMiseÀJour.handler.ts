import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { getLogger } from '@potentiel-libraries/monitoring';

import { GarantiesFinancièresNotificationsProps } from '../../type';
import { listerPorteursRecipients } from '../../../../../_helpers';
import { garantiesFinancièresNotificationTemplateId } from '../../constant';

export const handleDemandeMainlevéeMiseÀJour = async ({
  event,
  sendEmail,
  projet,
  baseUrl,
}: GarantiesFinancièresNotificationsProps<
  | Lauréat.GarantiesFinancières.InstructionDemandeMainlevéeGarantiesFinancièresDémarréeEvent
  | Lauréat.GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresAccordéeEvent
  | Lauréat.GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresRejetéeEvent
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
    templateId: garantiesFinancièresNotificationTemplateId.mainlevée.modifiéePourPorteur,
    messageSubject: `Potentiel - Le statut de la demande de mainlevée des garanties financières a été modifié ${projet.nom}`,
    recipients: porteurs,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      region_projet: projet.région,
      url: `${baseUrl}${Routes.GarantiesFinancières.détail(identifiantProjet.formatter())}`,
    },
  });
};
