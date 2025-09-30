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

    const fichiers = mapApiResponseToFichiers(dossier);
    return {
      demarcheId: dossier.demarche.number,
      dépôt: {
        ...mapApiResponseToDépôt(dossier),
        attestationConstitutionGf: fichiers.garantiesFinancières ? { format: fichiers.garantiesFinancières.contentType } : undefined,
      } satisfies DeepPartial<Candidature.Dépôt.RawType>,
      fichiers,
      détails: mapApiResponseToDétails(dossier),
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
    .filter((node) => node && (node.state === 'accepte' || node.state === 'en_instruction'))
    .map((node) => node!.number);
};

const mapApiResponseToFichiers = ({ champs, demarche }: GetDossierQuery['dossier']) => {
  const accessor = createDossierAccessor(
    champs,
    {
      garantiesFinancières: 'Garantie financière de mise en œuvre du projet',
    },
    demarche.revision.champDescriptors,
  );
  return {
    garantiesFinancières: accessor.getUrlPièceJustificativeValue('garantiesFinancières'),
  };
};

const mapApiResponseToDétails = ({ champs }: GetDossierQuery['dossier']) => {
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
