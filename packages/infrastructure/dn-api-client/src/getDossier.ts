import type { Candidature } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

import { type DeepPartial, mapApiResponseToDépôt } from './_helpers/index.js';
import { getDémarcheNumériqueApiClient } from './graphql/index.js';

export type Dossier = Awaited<ReturnType<typeof getDossier>>;

export const getDossier = async (dossierNumber: number) => {
  const sdk = getDémarcheNumériqueApiClient();
  const logger = getLogger('dn-api-client');
  logger.debug(`Lecture du dossier ${dossierNumber}`);
  try {
    const { dossier } = await sdk.GetDossier({ dossier: dossierNumber });

    const { champs } = dossier;

    return {
      dépôt: {
        ...mapApiResponseToDépôt({
          champs,
        }),
      } satisfies DeepPartial<Candidature.Dépôt.RawType>,
    };
  } catch (e) {
    logger.warn('Impossible de lire le dossier', {
      dossierNumber,
      errorMessage: e instanceof Error ? e.message : 'unknown',
      errorData: e,
    });
    return Option.none;
  }
};
