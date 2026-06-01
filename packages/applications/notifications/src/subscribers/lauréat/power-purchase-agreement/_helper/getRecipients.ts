import { mediator } from 'mediateur';

import type { IdentifiantProjet } from '@potentiel-domain/projet';
import type { ConsulterUtilisateurQuery } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerDgecRecipients } from '../../../../helpers/listerDgecRecipients.js';
import { listerDrealsRecipients } from '../../../../helpers/listerDrealsRecipients.js';
import { listerPorteursRecipients } from '../../../../helpers/listerPorteursRecipients.js';

export const getRecipients = async (
  identifiantProjet: IdentifiantProjet.ValueType,
  identifiantUtilisateur: string,
  région: string,
) => {
  const logger = getLogger('getRecipients');

  const utilisateur = await mediator.send<ConsulterUtilisateurQuery>({
    type: 'Utilisateur.Query.ConsulterUtilisateur',
    data: {
      identifiantUtilisateur,
    },
  });

  if (Option.isNone(utilisateur)) {
    logger.warn("L'utilisateur n'existe pas");
    return;
  }

  const drealsRecipients = await listerDrealsRecipients(région);
  const recipientsByRôle = [drealsRecipients];

  if (utilisateur.rôle.estPorteur()) {
    const dgecRecipients = await listerDgecRecipients(identifiantProjet);
    recipientsByRôle.push(dgecRecipients);
  } else {
    const porteursRecipients = await listerPorteursRecipients(identifiantProjet);
    recipientsByRôle.push(porteursRecipients);
  }

  return recipientsByRôle;
};
