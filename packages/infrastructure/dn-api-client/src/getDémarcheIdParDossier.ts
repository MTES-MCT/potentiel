import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

import { getDémarcheNumériqueApiClient } from './graphql/index.js';

export const getDémarcheIdParDossier = async (dossierNumber: number) => {
  const sdk = getDémarcheNumériqueApiClient();
  const logger = getLogger('dn-api-client');
  logger.debug(`Lecture de la démarche du dossier ${dossierNumber}`);
  try {
    const { dossier } = await sdk.GetDemarcheIdParDossier({ dossier: dossierNumber });

    return dossier.demarche.number;
  } catch (e) {
    logger.warn('Impossible de lire la démarche', {
      dossierNumber,
      errorMessage: e instanceof Error ? e.message : 'unknown',
      errorData: e,
    });
    return Option.none;
  }
};
