import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getBaseUrl, listerPorteursRecipients, NotificationHandlerProps } from '../../../_helpers';
import { candidatureNotificationTemplateId } from '../constant';

export const handleCandidatureCorrigée = async ({
  sendEmail,
  event,
}: NotificationHandlerProps<Candidature.CandidatureCorrigéeEvent>) => {
  if (!event.payload.doitRégénérerAttestation) {
    return;
  }

  const porteurs = await listerPorteursRecipients(
    IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet),
  );

  if (porteurs.length > 0) {
    await sendEmail({
      templateId: candidatureNotificationTemplateId.attestationRegénéréePorteur,
      messageSubject: `Potentiel - Une nouvelle attestation est disponible pour le projet ${event.payload.nomProjet}`,
      recipients: porteurs,
      variables: {
        nom_projet: event.payload.nomProjet,
        raison: 'Votre candidature a été modifiée',
        redirect_url: `${getBaseUrl()}${Routes.Projet.details(event.payload.identifiantProjet)}`,
      },
    });
  }
};
