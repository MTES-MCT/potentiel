import { GarantiesFinancières } from '@potentiel-domain/laureat';

const statutMainlevéeLabels: Record<
  GarantiesFinancières.StatutMainLevéeGarantiesFinancières.RawType,
  string
> = {
  demandé: 'Demandé',
  'en-instruction': 'En instruction',
  accordé: 'Accordé',
  rejeté: 'Rejeté',
};

const motifMainlevéeLabels: Record<
  GarantiesFinancières.MotifDemandeMainLevéeGarantiesFinancières.RawType,
  string
> = {
  'projet-abandonné': 'Projet abandonnée',
  'projet-achevé': 'Projet achevé',
};

export const convertStatutMainlevéeForView = (statut: string) => {
  const statutRawType =
    GarantiesFinancières.StatutMainLevéeGarantiesFinancières.convertirEnValueType(statut).statut;
  return statutMainlevéeLabels[statutRawType];
};

export const convertMotifMainlevéeForView = (motif: string) => {
  const motifRawType =
    GarantiesFinancières.MotifDemandeMainLevéeGarantiesFinancières.convertirEnValueType(
      motif,
    ).motif;
  return motifMainlevéeLabels[motifRawType];
};
