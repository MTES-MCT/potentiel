import { IdentifiantProjet } from '@potentiel-domain/projet';

export const getFiltersFromSearch = (search?: string) => {
  if (!search) return { identifiantProjet: undefined, nomProjet: undefined };

  const cleanedSearch = search?.trim();

  if (IdentifiantProjet.estValide(cleanedSearch)) {
    return {
      identifiantProjet: [IdentifiantProjet.convertirEnValueType(cleanedSearch).formatter()],
      nomProjet: undefined,
    };
  }

  if (IdentifiantProjet.estValideMétier(cleanedSearch)) {
    return {
      identifiantProjet: [IdentifiantProjet.depuisIdentifiantMétier(cleanedSearch).formatter()],
      nomProjet: undefined,
    };
  }

  return { nomProjet: cleanedSearch, identifiantProjet: undefined };
};
