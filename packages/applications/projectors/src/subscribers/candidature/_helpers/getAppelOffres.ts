import { AppelOffre } from '@potentiel-domain/appel-offre';
import { appelsOffreData } from '@potentiel-domain/inmemory-referential';
import { IdentifiantProjet } from '@potentiel-domain/projet';

export const getAppelOffres = (identifiantProjet: IdentifiantProjet.ValueType) => {
  const appelOffres = appelsOffreData.find((ao) => ao.id === identifiantProjet.appelOffre);
  if (!appelOffres) {
    throw new Error("Appel d'offres non trouvé");
  }
  return appelOffres;
};

export const getPériodeAndFamille = (
  identifiantProjet: IdentifiantProjet.ValueType,
  appelOffre: AppelOffre.AppelOffreReadModel,
) => {
  const période = appelOffre.periodes.find((période) => période.id === identifiantProjet.période);

  if (!période) {
    throw new Error('Période non trouvée');
  }

  const famille = période.familles?.find((famille) => famille.id === identifiantProjet.famille);

  return { période, famille };
};
