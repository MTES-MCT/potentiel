import { mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import type { Lauréat } from '@potentiel-domain/projet';
import type { ConsulterUtilisateurQuery } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

import {
  buildUrl,
  getLauréat,
  listerDgecRecipients,
  listerDrealsRecipients,
  listerPorteursRecipients,
} from '#helpers';
import { sendEmail } from '#sendEmail';

export const handlePowerPurchaseAgreementSignalé = async ({
  payload: { identifiantProjet, signaléPar },
}: Lauréat.PowerPurchaseAgreement.PowerPurchaseAgreementSignaléEvent) => {
  const logger = getLogger('handlePowerPurchaseAgreementSignalé');

  const projet = await getLauréat(identifiantProjet);

  const utilisateur = await mediator.send<ConsulterUtilisateurQuery>({
    type: 'Utilisateur.Query.ConsulterUtilisateur',
    data: {
      identifiantUtilisateur: signaléPar,
    },
  });

  if (Option.isNone(utilisateur)) {
    logger.warn("L'utilisateur n'existe pas");
    return;
  }

  const recipients = await listerDrealsRecipients(projet.région);

  if (utilisateur.rôle.estPorteur()) {
    const dgecRecipients = await listerDgecRecipients(projet.identifiantProjet);
    recipients.push(...dgecRecipients);
  } else {
    const porteursRecipients = await listerPorteursRecipients(projet.identifiantProjet);
    recipients.push(...porteursRecipients);
  }

  await sendEmail({
    key: 'lauréat/power-purchase-agreement/signaler',
    recipients,
    values: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: buildUrl(Routes.Lauréat.détails.tableauDeBord(projet.identifiantProjet.formatter())),
      appel_offre: projet.identifiantProjet.appelOffre,
      période: projet.identifiantProjet.période,
    },
  });
};
