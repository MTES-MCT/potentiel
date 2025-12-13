import { IdentifiantProjet, Éliminé } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getBaseUrl, listerPorteursRecipients } from '#helpers';

import { recoursNotificationTemplateId } from '../constant.js';
import { RecoursNotificationsProps } from '../type.js';

export const handleRecoursPasséEnInstruction = async ({
  sendEmail,
  event,
  projet,
}: RecoursNotificationsProps<Éliminé.Recours.RecoursPasséEnInstructionEvent>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteursRecipients = await listerPorteursRecipients(identifiantProjet);

  await sendEmail({
    templateId: recoursNotificationTemplateId.passerEnInstruction,
    messageSubject: `Potentiel - La demande de recours pour le projet ${projet.nom} est en instruction`,
    recipients: porteursRecipients,
    variables: {
      nom_projet: projet.nom,
      redirect_url: `${getBaseUrl()}${Routes.Recours.détailPourRedirection(identifiantProjet.formatter())}`,
      departement_projet: projet.département,
    },
  });
};
