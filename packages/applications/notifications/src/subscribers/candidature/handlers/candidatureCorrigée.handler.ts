import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getBaseUrl, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleCandidatureCorrigée = async ({
  payload: { identifiantProjet, doitRégénérerAttestation, nomProjet, localité },
}: Candidature.CandidatureCorrigéeEvent) => {
  const identifiantProjetValue = IdentifiantProjet.convertirEnValueType(identifiantProjet);

  if (!doitRégénérerAttestation) {
    return;
  }

  const porteurs = await listerPorteursRecipients(identifiantProjetValue);

  await sendEmail({
    key: 'candidature/régénérer_attestation',
    recipients: porteurs,
    values: {
      nom_projet: nomProjet,
      departement_projet: localité.département,
      appel_offre: identifiantProjet,
      période: identifiantProjetValue.période,
      url: `${getBaseUrl()}${Routes.Projet.details(identifiantProjet)}`,
    },
  });
};
