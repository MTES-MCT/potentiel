import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Lauréat } from '@potentiel-domain/projet';

import { sendEmail } from '#sendEmail';
import { formatDateForEmail, getLauréat, listerPorteursRecipients } from '#helpers';

export const handleCahierDesChargesChoisi = async ({
  payload: { identifiantProjet, cahierDesCharges },
}: Lauréat.CahierDesChargesChoisiEvent) => {
  const projet = await getLauréat(identifiantProjet);

  const recipients = await listerPorteursRecipients(projet.identifiantProjet);
  const cdc = AppelOffre.RéférenceCahierDesCharges.convertirEnValueType(cahierDesCharges);

  const commonValues = {
    nom_projet: projet.nom,
    departement_projet: projet.département,
    appel_offre: projet.identifiantProjet.appelOffre,
    période: projet.identifiantProjet.période,
    url: projet.url,
  };

  if (cdc.type === 'initial') {
    return await sendEmail({
      key: 'lauréat/cahier-des-charges/choisir_initial',
      recipients,
      values: commonValues,
    });
  } else {
    return await sendEmail({
      key: 'lauréat/cahier-des-charges/choisir_modifié',
      recipients,
      values: {
        ...commonValues,
        cdc_date: formatDateForEmail(new Date(cdc.paruLe)),
        cdc_alternatif: cdc.alternatif ? 'alternatif ' : '',
      },
    });
  }
};
