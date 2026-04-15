import { appelsOffreData } from '@potentiel-domain/inmemory-referential';
import { IdentifiantProjet } from '@potentiel-domain/projet';

export const getAppelOffres = (identifiantProjet: IdentifiantProjet.ValueType) => {
  const appelOffres = appelsOffreData.find((ao) => ao.id === identifiantProjet.appelOffre);
  if (!appelOffres) {
    throw new Error("Appel d'offres non trouvé");
  }
  return appelOffres;
};
