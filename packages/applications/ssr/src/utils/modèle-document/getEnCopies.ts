import { match, P } from 'ts-pattern';

export const getEnCopies = (region: string): Array<string> => {
  if (!region) {
    return ['DREAL concernée', 'CRE'];
  }
  const cocontractant = match(region)
    .with('Mayotte', () => 'EDM')
    .with(P.union('Guadeloupe', 'Guyane', 'Martinique', 'Corse', 'La Réunion'), () => 'EDF SEI')
    .otherwise(() => 'EDF OA');

  return [cocontractant, `DREAL ${region}`, 'CRE'];
};
