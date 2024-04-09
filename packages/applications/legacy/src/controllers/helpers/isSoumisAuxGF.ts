import { ConsulterAppelOffreReadModel } from '@potentiel-domain/appel-offre';

export const isSoumisAuxGF = ({
  appelOffres,
  famille,
}: {
  appelOffres: ConsulterAppelOffreReadModel;
  famille?: string;
}) => {
  return famille
    ? appelOffres.familles.find((f) => f.id === famille)?.soumisAuxGarantiesFinancieres !==
        'non soumis'
    : appelOffres.soumisAuxGarantiesFinancieres !== 'non soumis';
};
