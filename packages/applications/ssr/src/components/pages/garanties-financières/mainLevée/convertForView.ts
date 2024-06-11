import { GarantiesFinancières } from '@potentiel-domain/laureat';

const statutMainLeveeLabels: Record<
  GarantiesFinancières.StatutMainLevéeGarantiesFinancières.RawType,
  string
> = {
  demandé: 'Demandé',
  'en-instruction': 'En instruction',
  accordé: 'Accordé',
  rejeté: 'Rejeté',
};

const motifMainLeveeLabels: Record<
  GarantiesFinancières.MotifDemandeMainLevéeGarantiesFinancières.RawType,
  string
> = {
  'projet-abandonné': 'Projet abandonnée',
  'projet-achevé': 'Projet achevé',
};

export const convertStatutMainLeveeForView = (statut: string) => {
  const statutRawType =
    GarantiesFinancières.StatutMainLevéeGarantiesFinancières.convertirEnValueType(statut).statut;
  return statutMainLeveeLabels[statutRawType];
};

export const convertMotifMainLeveeForView = (motif: string) => {
  const motifRawType =
    GarantiesFinancières.MotifDemandeMainLevéeGarantiesFinancières.convertirEnValueType(
      motif,
    ).motif;
  return motifMainLeveeLabels[motifRawType];
};
