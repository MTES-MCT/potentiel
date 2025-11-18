import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { listerDrealsRecipients } from '#helpers';

import { GarantiesFinancièresNotificationsProps } from '../../type.js';
import { garantiesFinancièresNotificationTemplateId } from '../../constant.js';

export const handleAttestationGarantiesFinancièresEnregistrée = async ({
  event,
  sendEmail,
  projet,
  baseUrl,
}: GarantiesFinancièresNotificationsProps<Lauréat.GarantiesFinancières.AttestationGarantiesFinancièresEnregistréeEvent>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

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
