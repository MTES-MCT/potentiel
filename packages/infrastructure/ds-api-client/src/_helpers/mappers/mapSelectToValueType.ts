import { DossierAccessor } from '../../graphql/index.js';

export const mapSelectToValueType = <T>(
  map: Record<string, T>,
  accessor: DossierAccessor,
  nom: string,
) => {
  const value = accessor.getStringValue(nom);
  if (!value) {
    return;
  }
  if (map[value]) {
    return map[value];
  }
  throw new ValeurInconnuePourChampsSelectError(nom, value);
};

class ValeurInconnuePourChampsSelectError extends Error {
  constructor(
    public nomDuChamp: string,
    public valeur: unknown,
  ) {
    super('La valeur fournie est invalide');
  }
}
