import { Option } from '@potentiel-libraries/monads';

import { GetDossierQuery, getDSApiClient, getUrlPièceJustificativeValue } from './graphql';
import { mapApiResponseToDépôt } from './dépôt';

export type Dossier = Awaited<ReturnType<typeof getDépôtCandidature>>;

export const getDépôtCandidature = async (dossierNumber: number) => {
  const sdk = getDSApiClient();
  try {
    const { dossier } = await sdk.GetDossier({ dossier: dossierNumber });

    return {
      dépôt: mapApiResponseToDépôt(dossier),
      fichiers: mapApiResponseToFichiers(dossier),
      détails: mapApiResponseToDétails(dossier),
    };
  } catch (e) {
    console.log(e);

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

const mapApiResponseToFichiers = ({ champs }: GetDossierQuery['dossier']) => ({
  garantiesFinancièresUrl: getUrlPièceJustificativeValue(
    champs,
    'Pièce n°2 : Garantie financière de mise en œuvre',
  ),
});

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
