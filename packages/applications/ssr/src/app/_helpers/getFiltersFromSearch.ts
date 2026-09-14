import { IdentifiantProjet } from '@potentiel-domain/projet';

export const getFiltersFromSearch = (nomProjet?: string) => {
  if (!nomProjet) return { identifiantProjet: undefined, nomProjet: undefined };

  const cleanedNomProjet = nomProjet?.trim();

  if (IdentifiantProjet.estValide(cleanedNomProjet)) {
    return {
      identifiantProjet: IdentifiantProjet.convertirEnValueType(cleanedNomProjet).formatter(),
      nomProjet: undefined,
    };
  }

  if (IdentifiantProjet.estValideMétier(cleanedNomProjet)) {
    return {
      identifiantProjet: IdentifiantProjet.depuisIdentifiantMétier(cleanedNomProjet).formatter(),
      nomProjet: undefined,
    };
  }

  return { nomProjet: cleanedNomProjet, identifiantProjet: undefined };
};
