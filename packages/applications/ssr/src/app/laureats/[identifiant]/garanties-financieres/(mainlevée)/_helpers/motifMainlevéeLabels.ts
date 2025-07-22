import { Lauréat } from '@potentiel-domain/projet';

export const motifMainlevéeLabels: Record<
  Lauréat.GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.RawType,
  string
> = {
  'projet-abandonné': 'Projet abandonné',
  'projet-achevé': 'Projet achevé',
};

export const convertMotifMainlevéeForView = (motif: string) => {
  const motifRawType =
    Lauréat.GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.convertirEnValueType(
      motif,
    ).motif;
  return motifMainlevéeLabels[motifRawType];
};
