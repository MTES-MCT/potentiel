import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

import { mapApiResponseToDépôt, mapApiResponseToDétails } from './_helpers/index.js';
import { getDémarcheNumériqueApiClient } from './graphql/index.js';

const fetchDossiers = async (dossiersIds: number[]) => {
  const logger = getLogger('dn-api-client');
  const sdk = getDémarcheNumériqueApiClient();
  const dossiers = [];
  const concurrency =
    Number(process.env.DEMARCHE_NUMERIQUE_API_CONCURRENCY) > 0
      ? Number(process.env.DEMARCHE_NUMERIQUE_API_CONCURRENCY)
      : 10;

  for (let i = 0; i < dossiersIds.length; i += concurrency) {
    const batch = dossiersIds.slice(i, i + concurrency);
    try {
      const résultats = await Promise.all(
        batch.map(async (dossierId) => {
          const { dossier } = await sdk.GetDossier({ dossier: dossierId });
          return dossier;
        }),
      );
      dossiers.push(...résultats.filter((dossier) => dossier !== null));
    } catch (e) {
      logger.error('Erreur lors de la récupération des dossiers de la démarche', {
        errorMessage: e instanceof Error ? e.message : 'unknown',
        errorData: e,
      });
    }
  }
  return { dossiers };
};

const fetchAllDossiers = async (démarcheId: number) => {
  const dossiers = [];
  let hasNextPage = true;
  const first = process.env.DEMARCHE_NUMERIQUE_API_PAGE_SIZE
    ? Number(process.env.DEMARCHE_NUMERIQUE_API_PAGE_SIZE)
    : undefined;
  let after: string | undefined;

  const sdk = getDémarcheNumériqueApiClient();

  while (hasNextPage) {
    const { demarche } = await sdk.GetDemarcheAvecDossiers({
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

type GetDémarcheAvecDossiersProps = { démarcheId: number; dossiersIds?: number[] };

export const getDémarcheAvecDossiers = async ({
  dossiersIds,
  démarcheId,
}: GetDémarcheAvecDossiersProps) => {
  const logger = getLogger('dn-api-client');
  try {
    const { dossiers } = dossiersIds
      ? await fetchDossiers(dossiersIds)
      : await fetchAllDossiers(démarcheId);

    return dossiers
      .filter((dossier) => !!dossier)
      .map((dossier) => {
        const { champs } = dossier;

        return {
          numeroDN: dossier.number,
          dépôt: mapApiResponseToDépôt({ champs }),
          détails: mapApiResponseToDétails({ champs }),
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
