import { getLogger } from '@potentiel-libraries/monitoring';
import { Candidature } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { getDSApiClient } from './graphql';
import {
  DeepPartial,
  mapApiResponseToDépôt,
  mapApiResponseToDétails,
  mapApiResponseToFichiers,
} from './_helpers';

const fetchAllDossiers = async (démarcheId: number) => {
  const dossiers = [];
  let hasNextPage = true;
  const first = process.env.DS_LIMIT_DOSSIER_PAGINATION
    ? Number(process.env.DS_LIMIT_DOSSIER_PAGINATION)
    : undefined;
  let after: string | undefined = undefined;

  const sdk = getDSApiClient();

  while (hasNextPage) {
    const { demarche } = await sdk.GetDemarcheAvecDossier({
      demarche: démarcheId,
      first,
      after,
    });

    dossiers.push(...(demarche.dossiers.nodes ?? []));

    hasNextPage = demarche.dossiers.pageInfo.hasNextPage;

    after = demarche.dossiers.pageInfo.endCursor ?? undefined;
  }
  return { dossiers };
};

export const getDémarcheAvecDossier = async (démarcheId: number) => {
  const logger = getLogger('ds-api-client');
  try {
    const { dossiers } = await fetchAllDossiers(démarcheId);

    return dossiers
      .filter((dossier) => !!dossier)
      .map((dossier) => {
        const { champs } = dossier;

        const fichiers = mapApiResponseToFichiers({
          champs: dossier.champs,
        });

        return {
          numeroDS: dossier.number,
          dépôt: {
            ...mapApiResponseToDépôt({
              champs,
            }),
            attestationConstitutionGf: fichiers.garantiesFinancières
              ? { format: fichiers.garantiesFinancières.contentType }
              : undefined,
          } satisfies DeepPartial<Candidature.Dépôt.RawType>,
          fichiers,
          détails: mapApiResponseToDétails({
            champs,
          }),
        };
      });
  } catch (e) {
    logger.error('Impossible de lire les dossiers de la démarche', {
      démarcheId,
      errorMessage: e instanceof Error ? e.message : 'unknown',
      errorData: e,
    });
    return Option.none;
  }
};
