import { redirect } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';

type RouteFunction = (identifiantProjet: string) => string;
export const redirigerPageProjet = (
  nomProjet: string,
  route: RouteFunction = Routes.Projet.details,
) => {
  const cleanedNomProjet = nomProjet.trim();

  if (IdentifiantProjet.estValide(cleanedNomProjet)) {
    return redirect(route(cleanedNomProjet));
  }
  if (IdentifiantProjet.estValideMétier(cleanedNomProjet)) {
    const identifiantProjet = IdentifiantProjet.depuisIdentifiantMétier(cleanedNomProjet);
    return redirect(route(identifiantProjet.formatter()));
  }
};
