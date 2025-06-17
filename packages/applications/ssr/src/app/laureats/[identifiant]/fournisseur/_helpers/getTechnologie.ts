import { AppelOffre } from '@potentiel-domain/appel-offre';
import { InvalidOperationError } from '@potentiel-domain/core';
import { Candidature } from '@potentiel-domain/projet';

export type GetTechnologieProps = {
  appelOffres: AppelOffre.AppelOffreReadModel;
  technologie: Candidature.TypeTechnologie.ValueType;
};
export const getTechnologie = ({
  appelOffres,
  technologie: technologieCandidature,
}: GetTechnologieProps) => {
  const technologie = appelOffres.technologie ?? technologieCandidature.type;

  if (technologie === 'N/A') {
    throw new InvalidOperationError(`Le type de technologie de ce projet est inconnu`);
  }

  if (technologie === 'hydraulique') {
    throw new InvalidOperationError(
      `Le type de technologie de ce projet ne permet pas un changement de fournisseur`,
    );
  }
  return technologie;
};
