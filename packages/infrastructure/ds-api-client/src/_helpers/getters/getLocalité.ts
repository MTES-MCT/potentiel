import { DossierAccessor } from '../../graphql/index.js';

export const getLocalité = <T extends Record<string, string>, TName extends string & keyof T>(
  accessor: DossierAccessor<T>,
  nom: TName,
) => {
  const { streetAddress, departmentName, regionName, cityName, postalCode } =
    accessor.getAdresse(nom) ?? {};

  return {
    adresse1: streetAddress ?? undefined,
    département: departmentName ?? undefined,
    région: regionName ?? undefined,
    commune: cityName ?? undefined,
    codePostal: postalCode ?? undefined,
  };
};
