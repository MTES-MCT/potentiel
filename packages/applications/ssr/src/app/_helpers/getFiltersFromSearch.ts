import { IdentifiantProjet } from "@potentiel-domain/projet";

export const getFiltersFromSearch = (nomProjet?: string) => {
  if (!nomProjet) return undefined;

  const cleanedNomProjet = nomProjet?.trim();

  if (IdentifiantProjet.estValide(cleanedNomProjet)) {
    return {identifiantProjet: IdentifiantProjet.convertirEnValueType(cleanedNomProjet).formatter()};
  }

  if (IdentifiantProjet.estValideMétier(cleanedNomProjet)) {
    return {identifiantProjet: IdentifiantProjet.depuisIdentifiantMétier(cleanedNomProjet).formatter()};
  }

  return {nomProjet}
};