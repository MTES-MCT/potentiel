import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerDrealsRecipients } from '../../../../../helpers';

import { GarantiesFinancièresNotificationsProps } from '../../type';
import { garantiesFinancièresNotificationTemplateId } from '../../constant';

export const handleAttestationGarantiesFinancièresEnregistrée = async ({
  event,
  sendEmail,
  projet,
  baseUrl,
}: GarantiesFinancièresNotificationsProps<Lauréat.GarantiesFinancières.AttestationGarantiesFinancièresEnregistréeEvent>) => {
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
    templateId:
      garantiesFinancièresNotificationTemplateId.actuelles.attestationEnregistréePourDreal,
    messageSubject: `Potentiel - Attestation de constitution des garanties financières enregistrée pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: dreals,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      region_projet: projet.région,
      url: `${baseUrl}${Routes.GarantiesFinancières.détail(identifiantProjet.formatter())}`,
    },
  });
};
