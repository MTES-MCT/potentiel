import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { getBaseUrl, getLauréat, listerDgecRecipients, listerDrealsRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleChangementPuissanceDemandé = async ({
  payload,
}: Lauréat.Puissance.ChangementPuissanceDemandéEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);

  const recipients = await listerDrealsRecipients(projet.région);

  if (payload.autoritéCompétente === 'dgec-admin') {
    const dgecs = await listerDgecRecipients(
      IdentifiantProjet.convertirEnValueType(payload.identifiantProjet),
    );
    recipients.push(...dgecs);
  }

  return sendEmail({
    key: 'lauréat/puissance/demande/demander',
    recipients,
    values: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      appel_offre: projet.identifiantProjet.appelOffre,
      période: projet.identifiantProjet.période,
      url: `${getBaseUrl()}${Routes.Puissance.changement.détails(projet.identifiantProjet.formatter(), payload.demandéLe)}`,
    },
  });
};
