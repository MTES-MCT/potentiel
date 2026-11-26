import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

import { mapApiResponseToDépôt, mapApiResponseToFichiers } from './_helpers/index.js';
import { getDémarcheNumériqueApiClient } from './graphql/index.js';

export type Dossier = Awaited<ReturnType<typeof getDossier>>;

export const getDossier = async (dossierNumber: number) => {
  const sdk = getDémarcheNumériqueApiClient();
  const logger = getLogger('dn-api-client');
  logger.debug(`Lecture du dossier ${dossierNumber}`);
  try {
    const { dossier } = await sdk.GetDossier({ dossier: dossierNumber });

    const { champs } = dossier;

    const fichiers = mapApiResponseToFichiers({ champs });

    if (fichiers.garantiesFinancières.length === 0) {
      logger.warn(`Aucun fichier GF trouvé pour le dossier ${dossierNumber}`);
    }

    const dépôt = mapApiResponseToDépôt({ champs });

    if (dépôt.valide) {
      return {
        dépôt: {
          ...mapApiResponseToDépôt({
            champs,
          }),
        },
        fichiers,
      };
    } else {
      logger.warn('Dépôt invalide', {
        dossierNumber,
        errorMessage: 'unknown',
      });
      return Option.none;
    }
  } catch (e) {
    logger.warn('Impossible de lire le dossier', {
      dossierNumber,
      errorMessage: e instanceof Error ? e.message : 'unknown',
      errorData: e,
    });
    return Option.none;
  }
};
