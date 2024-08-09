import { AppelOffre } from '@potentiel-domain/appel-offre';

export const isSoumisAuxGF = ({
  appelOffres,
  période,
  famille,
}: {
  appelOffres: AppelOffre.ConsulterAppelOffreReadModel;
  période: string;
  famille?: string;
}) => {
  const familleDétails = appelOffres.periodes
    .find((p) => p.id === période)
    ?.familles.find((f) => f.id === famille);

  return familleDétails
    ? familleDétails.soumisAuxGarantiesFinancieres !== 'non soumis'
    : appelOffres.soumisAuxGarantiesFinancieres !== 'non soumis';
};
