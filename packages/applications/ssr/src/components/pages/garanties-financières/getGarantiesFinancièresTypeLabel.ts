import { GarantiesFinancières } from '@potentiel-domain/laureat';

export const getGarantiesFinancièresTypeLabel = (
  type: GarantiesFinancières.TypeGarantiesFinancières.RawType,
) => {
  switch (type) {
    case 'consignation':
      return 'Consignation';
    case 'avec-date-échéance':
      return "Avec date d'échéance";
    case 'six-mois-après-achèvement':
      return 'Six mois après achèvement';
    case 'type-inconnu':
      return '';
  }
};
