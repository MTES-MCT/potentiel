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

    const {
      champs,
      demarche: {
        revision: { champDescriptors },
      },
    } = dossier;

    const fichiers = mapApiResponseToFichiers({
      champs,
      champDescriptors,
    });
    return {
      demarcheId: dossier.demarche.number,
      dépôt: {
        ...mapApiResponseToDépôt({
          champs,
          champDescriptors,
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

export const getDossiersDemarche = async (démarcheNumber: number) => {
  const sdk = getDSApiClient();
  const { demarche } = await sdk.GetDemarche({ demarche: démarcheNumber });
  if (!demarche.dossiers.nodes) return [];

  return demarche.dossiers.nodes
    .filter(
      (dossier) => dossier && (dossier.state === 'accepte' || dossier.state === 'en_instruction'),
    )
    .map((dossier) => {
      if (!dossier) throw new Error('dossier is null');

      const { champs } = dossier;
      const { champDescriptors } = demarche.activeRevision;

      const fichiers = mapApiResponseToFichiers({
        champs,
        champDescriptors,
      });

      return {
        demarcheId: démarcheNumber,
        dépôt: {
          ...mapApiResponseToDépôt({
            champs,
            champDescriptors,
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
};

type MapApiResponseToFichiers = {
  champs: GetDossierQuery['dossier']['champs'];
  champDescriptors: GetDossierQuery['dossier']['demarche']['revision']['champDescriptors'];
};

const mapApiResponseToFichiers = ({ champs, champDescriptors }: MapApiResponseToFichiers) => {
  const accessor = createDossierAccessor(
    champs,
    {
      garantiesFinancières: 'Garantie financière de mise en œuvre du projet',
    },
    champDescriptors,
  );
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
