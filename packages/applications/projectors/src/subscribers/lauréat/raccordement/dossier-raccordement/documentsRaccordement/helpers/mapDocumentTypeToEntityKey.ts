import type { Lauréat } from '@potentiel-domain/projet';

const typeToKeyMap: Record<Lauréat.Raccordement.TypeDocumentsRaccordement.RawType, string> = {
  'proposition-technique-et-financière': 'propositionTechniqueEtFinancière',
  'convention-de-raccordement': 'conventionDeRaccordement',
  'convention-directe-de-raccordement': 'conventionDirecteDeRaccordement',
};

export const mapDocumentTypeToEntityKey = (
  type: Lauréat.Raccordement.TypeDocumentsRaccordement.RawType,
) => {
  const key = typeToKeyMap[type];

  return key;
};
