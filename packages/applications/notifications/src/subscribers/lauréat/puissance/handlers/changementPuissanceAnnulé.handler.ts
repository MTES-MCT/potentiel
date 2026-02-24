import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getBaseUrl, getLauréat, listerDgecRecipients, listerDrealsRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleChangementPuissanceAnnulé = async ({
  payload,
}: Lauréat.Puissance.ChangementPuissanceAnnuléEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);
  const recipients = await listerDrealsRecipients(projet.région);

  if (payload.autoritéCompétente === 'dgec-admin') {
    const dgecs = await listerDgecRecipients(
      IdentifiantProjet.convertirEnValueType(payload.identifiantProjet),
    );
    recipients.push(...dgecs);
  }

  return sendEmail({
    key: 'lauréat/puissance/demande/annuler',
    recipients,
    values: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      appel_offre: projet.identifiantProjet.appelOffre,
      période: projet.identifiantProjet.période,
      url: `${getBaseUrl()}${Routes.Puissance.changement.détailsPourRedirection(projet.identifiantProjet.formatter())}`,
    },
  });
};
