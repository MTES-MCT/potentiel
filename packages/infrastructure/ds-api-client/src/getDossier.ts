import { getLogger } from '@potentiel-libraries/monitoring';
import { Candidature } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { getDSApiClient } from './graphql';
import { DeepPartial, mapApiResponseToDépôt, mapApiResponseToFichiers } from './_helpers';

export type Dossier = Awaited<ReturnType<typeof getDossier>>;

export const getDossier = async (dossierNumber: number) => {
  const sdk = getDSApiClient();
  const logger = getLogger('ds-api-client');
  logger.debug(`Lecture du dossier ${dossierNumber}`);
  try {
    const { dossier } = await sdk.GetDossier({ dossier: dossierNumber });

    const { champs } = dossier;

    const fichiers = mapApiResponseToFichiers({
      champs,
    });
    return {
      dépôt: {
        ...mapApiResponseToDépôt({
          champs,
        }),
        attestationConstitutionGf: fichiers.garantiesFinancières
          ? {
              format: fichiers.garantiesFinancières.contentType,
              url: fichiers.garantiesFinancières.url,
            }
          : undefined,
      } satisfies DeepPartial<
        Candidature.Dépôt.RawType & { attestationConstitutionGf?: { format: string; url: string } }
      >,
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
