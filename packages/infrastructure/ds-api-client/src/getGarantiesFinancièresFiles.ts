import { getLogger } from '@potentiel-libraries/monitoring';

import { getDSApiClient } from './graphql/index.js';
import { mapApiResponseToFichiers } from './_helpers/index.js';

export const getGarantiesFinancièresFiles = async (dossierNumber: number) => {
  const sdk = getDSApiClient();
  const logger = getLogger('ds-api-client');
  logger.debug(`Récupération des fichiers GF du dossier ${dossierNumber}`);

  try {
    const { dossier } = await sdk.GetDossier({ dossier: dossierNumber });

    const fichiers = mapApiResponseToFichiers({
      champs: dossier.champs,
    });

    return fichiers.garantiesFinancières.length > 0 ? fichiers.garantiesFinancières : [];
  } catch (error) {
    logger.warn('Impossible de récupérer les fichiers de garanties financières', {
      dossierNumber,
      errorMessage: error instanceof Error ? error.message : 'unknown',
      errorData: error,
    });
    return [];
  }
};
