import { appelsOffreData } from '@potentiel-domain/inmemory-referential';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { AppelOffre } from '@potentiel-domain/appel-offre';

// On utilise les données inmemory pour optimiser le rebuild
// La méthode est asynchrone pour anticiper un futur accès à la projection appel-offre
export const getAppelOffres = async (
  identifiantProjet: IdentifiantProjet.ValueType,
): Promise<AppelOffre.AppelOffreReadModel> => {
  const appelOffres = appelsOffreData.find((ao) => ao.id === identifiantProjet.appelOffre);
  if (!appelOffres) {
    throw new Error("Appel d'offres non trouvé");
  }
  return appelOffres;
};
