import { GarantiesFinancières } from '@potentiel-domain/laureat';

export const statutMainlevéeLabels: Record<
  GarantiesFinancières.StatutMainlevéeGarantiesFinancières.RawType,
  string
> = {
  demandé: 'Demandé',
  'en-instruction': 'En instruction',
  accordé: 'Accordé',
  rejeté: 'Rejeté',
};

export const convertStatutMainlevéeForView = (statut: string) => {
  const statutRawType =
    GarantiesFinancières.StatutMainlevéeGarantiesFinancières.convertirEnValueType(statut).statut;
  return statutMainlevéeLabels[statutRawType];
};
