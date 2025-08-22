import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

import { createDossierAccessor, GetDossierQuery, getDSApiClient } from './graphql';
import { mapApiResponseToDépôt } from './dépôt';

export type Dossier = Awaited<ReturnType<typeof getDépôtCandidature>>;

export const getDépôtCandidature = async (dossierNumber: number) => {
  const sdk = getDSApiClient();
  const logger = getLogger('ds-api-client');
  logger.debug(`Lecture du dossier ${dossierNumber}`);
  try {
    const { dossier } = await sdk.GetDossier({ dossier: dossierNumber });

    return {
      demarcheId: dossier.demarche.number,
      dépôt: mapApiResponseToDépôt(dossier),
      fichiers: mapApiResponseToFichiers(dossier),
      détails: mapApiResponseToDétails(dossier),
    };
  } catch (e) {
    logger.warn('Impossible de lire le dossier', {
      dossierNumber,
      error: e,
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
      garantiesFinancièresUrl: 'Garantie financière de mise en œuvre du projet',
    },
    demarche.revision.champDescriptors,
  );
  return {
    garantiesFinancièresUrl: accessor.getUrlPièceJustificativeValue('garantiesFinancièresUrl'),
  };
};

const mapApiResponseToDétails = ({ champs }: GetDossierQuery['dossier']) => {
  return champs.reduce(
    (prev, curr) => {
      if (prev[curr.label]) {
        console.warn(`le champs ${curr.label} existe déjà`);
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
