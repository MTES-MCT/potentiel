import { Lauréat } from '@potentiel-domain/projet';

import { getLauréat, listerDrealsRecipients, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleAttestationConformitéTransmise = async ({
  payload: { identifiantProjet },
}: Lauréat.Achèvement.AttestationConformitéTransmiseEvent) => {
  const projet = await getLauréat(identifiantProjet);

  const dreals = await listerDrealsRecipients(projet.région);
  const porteurs = await listerPorteursRecipients(projet.identifiantProjet);

  const values = {
    nom_projet: projet.nom,
    departement_projet: projet.département,
    appel_offre: projet.identifiantProjet.appelOffre,
    période: projet.identifiantProjet.période,
    url: projet.url,
  };

  await sendEmail({
    key: 'lauréat/achèvement/transmettre_attestation_porteur',
    recipients: porteurs,
    values,
  });

  await sendEmail({
    key: 'lauréat/achèvement/transmettre_attestation_dreal',
    recipients: dreals,
    values,
  });
};
