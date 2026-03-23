import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import {
  getLauréat,
  listerDrealsRecipients,
  getRôleFromEmail,
  listerPorteursRecipients,
  getBaseUrl,
} from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleDépôtGarantiesFinancièresModifié = async ({
  payload,
}: Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursModifiéEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);
  const rôleUtilisateur = await getRôleFromEmail(payload.modifiéPar);

  const dreals = rôleUtilisateur.estDreal() ? [] : await listerDrealsRecipients(projet.région);
  const porteurs = rôleUtilisateur.estPorteur()
    ? []
    : await listerPorteursRecipients(projet.identifiantProjet);

  for (const recipients of [dreals, porteurs]) {
    await sendEmail({
      key: 'lauréat/garanties-financières/dépôt/modifier',
      recipients,
      values: {
        nom_projet: projet.nom,
        departement_projet: projet.département,
        appel_offre: projet.identifiantProjet.appelOffre,
        période: projet.identifiantProjet.période,
        url: `${getBaseUrl()}${Routes.GarantiesFinancières.détail(projet.identifiantProjet.formatter())}`,
      },
    });
  }
};
