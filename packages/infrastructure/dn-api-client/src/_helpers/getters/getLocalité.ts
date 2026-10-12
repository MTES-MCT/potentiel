import type { DossierAccessor } from '../../graphql/index.js';

export const getLocalité = <T extends Record<string, string>, TName extends string & keyof T>(
  accessor: DossierAccessor<T>,
  nom: TName,
) => {
  const { streetAddress, departmentName, regionName, cityName, postalCode } =
    accessor.getAdresse(nom) ?? {};

  return {
    adresse1: cleanupInput(streetAddress),
    département: cleanupInput(departmentName),
    région: cleanupInput(regionName),
    commune: cleanupInput(cityName),
    codePostal: cleanupInput(postalCode),
  };
};

const cleanupInput = (str: string | null | undefined) => str?.replaceAll(/’/g, "'") ?? undefined;
