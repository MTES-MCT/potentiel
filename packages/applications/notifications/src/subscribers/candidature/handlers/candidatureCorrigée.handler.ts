import { Candidature } from '@potentiel-domain/projet';

export const handleCandidatureCorrigée = async (event: Candidature.CandidatureCorrigéeEvent) => {
  if (event.payload.doitRégénérerAttestation) {
    await sendEmail({
      templateId: templateId.attestationRegénéréePorteur,
      messageSubject: `Potentiel - Une nouvelle attestation est disponible pour le projet ${event.payload.nomProjet}`,
      recipients: [
        {
          email: event.payload.emailContact,
          fullName: event.payload.nomReprésentantLégal,
        },
      ],
      variables: {
        nom_projet: event.payload.nomProjet,
        raison: 'Votre candidature a été modifiée',
        redirect_url: `${getBaseUrl()}${Routes.Projet.details(identifiantProjet)}`,
      },
    });
  }
};
