import { AppelOffre } from '@potentiel-domain/appel-offre';

export const appelOffreSoumisAuxGarantiesFinancières = ({
  appelOffre,
  période,
  famille,
}: {
  appelOffre: AppelOffre.ConsulterAppelOffreReadModel;
  période: string;
  famille?: string;
}): boolean => {
  const familleDétails = appelOffre.periodes
    .find((p) => p.id === période)
    ?.familles.find((f) => f.id === famille);

  return familleDétails
    ? familleDétails.garantiesFinancières.soumisAuxGarantiesFinancieres !== 'non soumis'
    : appelOffre.garantiesFinancières.soumisAuxGarantiesFinancieres !== 'non soumis';
};
