export const getEnCopies = (region: string): Array<string> => {
  if (!region) {
    return ['DREAL concernée', 'CRE'];
  }

  const enCopie: string[] = [];

  if (['Guadeloupe', 'Guyane', 'Martinique', 'Corse', 'La Réunion', 'Mayotte'].includes(region)) {
    enCopie.push('EDF OA');
  }

  if (['Guadeloupe', 'Guyane', 'Martinique', 'Corse', 'La Réunion'].includes(region)) {
    enCopie.push('EDF SEI');
  }

  if (['Mayotte'].includes(region)) {
    enCopie.push('EDN');
  }

  return [...enCopie, `DREAL ${region}`];
};
