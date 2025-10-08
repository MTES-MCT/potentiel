import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Candidature } from '@potentiel-domain/projet';

import { createDossierAccessor, GetDossierQuery, getDSApiClient } from './graphql';
import { mapApiResponseToDépôt } from './dépôt';
import { DeepPartial } from './utils';

export type Dossier = Awaited<ReturnType<typeof getDépôtCandidature>>;

export const getDépôtCandidature = async (dossierNumber: number) => {
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
      demarcheId: dossier.demarche.number,
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
  } catch (e) {
    logger.warn('Impossible de lire le dossier', {
      dossierNumber,
      errorMessage: e instanceof Error ? e.message : 'unknown',
      errorData: e,
    });
    return Option.none;
  }
};

export const getDémarcheIdParDossier = async (dossierNumber: number) => {
  const sdk = getDSApiClient();
  const logger = getLogger('ds-api-client');
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

const fetchAllDossiers = async (démarcheId: number) => {
  const dossiers = [];
  let hasNextPage = true;
  const first = 1;
  let after: string | undefined = undefined;

  const sdk = getDSApiClient();

  while (hasNextPage) {
    const { demarche } = await sdk.GetDemarche({
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

export const getDossiersDemarche = async (démarcheId: number) => {
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

type MapApiResponseToFichiers = {
  champs: GetDossierQuery['dossier']['champs'];
};

const mapApiResponseToFichiers = ({ champs }: MapApiResponseToFichiers) => {
  const accessor = createDossierAccessor(champs, {
    garantiesFinancières: 'Garantie financière de mise en œuvre du projet',
  });
  return {
    garantiesFinancières: accessor.getUrlPièceJustificativeValue('garantiesFinancières'),
  };
};

type MapApiResponseToDétails = {
  champs: GetDossierQuery['dossier']['champs'];
};

const mapApiResponseToDétails = ({ champs }: MapApiResponseToDétails) => {
  const logger = getLogger('ds-api-client');
  return champs.reduce(
    (prev, curr) => {
      if (prev[curr.label]) {
        logger.warn(`le champs ${curr.label} existe déjà`);
        return prev;
      }
      if (curr.__typename === 'DateChamp') {
        prev[curr.label] = curr.date;
        return prev;
      }
      if (!curr.stringValue) return prev;
      if (curr.label.startsWith('En cochant cette case')) return prev;
      prev[curr.label] = curr.stringValue ?? undefined;
      return prev;
    },
    {} as Record<string, unknown>,
  );
};
