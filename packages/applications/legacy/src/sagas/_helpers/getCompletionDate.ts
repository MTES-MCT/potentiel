import { getDelaiDeRealisation } from '../../modules/projectAppelOffre';
import { DateTime } from '@potentiel-domain/common';
import { AppelOffre } from '@potentiel-domain/appel-offre';

export function getCompletionDate(
  notifiedOn: DateTime.ValueType,
  appelOffre: AppelOffre.AppelOffreReadModel,
  technologie: AppelOffre.Technologie,
) {
  const moisAAjouter = getDelaiDeRealisation(appelOffre, technologie) || 0;
  return notifiedOn.ajouterNombreDeMois(moisAAjouter).retirerNombreDeJours(1);
}
