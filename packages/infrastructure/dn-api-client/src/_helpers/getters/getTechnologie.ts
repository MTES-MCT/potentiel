import type { DossierAccessor } from '../../graphql/index.js';

export const getTechnologie = <T extends Record<string, string>, TName extends string & keyof T>(
  accessor: DossierAccessor<T>,
  nom: TName,
) => {
  const technologie = accessor.getStringValue(nom);

  return technologie === 'Installation photovoltaïque'
    ? 'pv'
    : technologie === 'Installation éolienne à terre'
      ? 'eolien'
      : technologie === 'Installation hydroélectrique'
        ? 'hydraulique'
        : 'N/A';
};
