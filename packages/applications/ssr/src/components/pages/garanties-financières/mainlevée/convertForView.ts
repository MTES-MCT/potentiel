import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Lauréat } from '@potentiel-domain/projet';

const statutMainlevéeLabels: Record<
  GarantiesFinancières.StatutMainlevéeGarantiesFinancières.RawType,
  string
> = {
  demandé: 'Demandé',
  'en-instruction': 'En instruction',
  accordé: 'Accordé',
  rejeté: 'Rejeté',
};

const motifMainlevéeLabels: Record<
  Lauréat.GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.RawType,
  string
> = {
  'projet-abandonné': 'Projet abandonné',
  'projet-achevé': 'Projet achevé',
};

export const convertStatutMainlevéeForView = (statut: string) => {
  const statutRawType =
    GarantiesFinancières.StatutMainlevéeGarantiesFinancières.convertirEnValueType(statut).statut;
  return statutMainlevéeLabels[statutRawType];
};

export const convertMotifMainlevéeForView = (motif: string) => {
  const motifRawType =
    Lauréat.GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.convertirEnValueType(
      motif,
    ).motif;
  return motifMainlevéeLabels[motifRawType];
};
