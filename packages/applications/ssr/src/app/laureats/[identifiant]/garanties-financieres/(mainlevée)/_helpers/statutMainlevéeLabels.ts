import { Lauréat } from '@potentiel-domain/projet';

export const statutMainlevéeLabels: Record<
  Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.RawType,
  string
> = {
  demandé: 'Demandé',
  'en-instruction': 'En instruction',
  accordé: 'Accordé',
  rejeté: 'Rejeté',
};

export const convertStatutMainlevéeForView = (statut: string) => {
  const statutRawType =
    Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.convertirEnValueType(
      statut,
    ).statut;
  return statutMainlevéeLabels[statutRawType];
};
