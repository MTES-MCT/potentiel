import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { listerDrealsRecipients, listerPorteursRecipients } from '#helpers';

import { GarantiesFinancièresNotificationsProps } from '../../type.js';
import { garantiesFinancièresNotificationTemplateId } from '../../constant.js';

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

  await sendEmail({
    templateId: garantiesFinancièresNotificationTemplateId.actuelles.miseÀJourPourDreal,
    messageSubject,
    recipients: dreals,
    variables,
  });

  await sendEmail({
    templateId: garantiesFinancièresNotificationTemplateId.actuelles.miseÀJourPourDreal,
    messageSubject,
    recipients: porteurs,
    variables,
  });
};
