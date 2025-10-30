import { IdentifiantProjet, Éliminé } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getBaseUrl, listerPorteursRecipients } from '../../../../_helpers';
import { recoursNotificationTemplateId } from '../constant';
import { RecoursNotificationsProps } from '../type';

export const handleRecoursPasséEnInstruction = async ({
  sendEmail,
  event,
  projet,
}: RecoursNotificationsProps<Éliminé.Recours.RecoursPasséEnInstructionEvent>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteursRecipients = await listerPorteursRecipients(identifiantProjet);

  await sendEmail({
    templateId: recoursNotificationTemplateId.accorder,
    messageSubject: `Potentiel - La demande de recours pour le projet ${projet.nom} est en instruction`,
    recipients: porteursRecipients,
    variables: {
      nom_projet: projet.nom,
      redirect_url: `${getBaseUrl()}${Routes.Recours.détail(identifiantProjet.formatter())}`,
      departement_projet: projet.département,
    },
  });
};
