import { TypeGarantiesFinancières } from '@potentiel-domain/common';

export const getGarantiesFinancièresTypeLabel = (type: TypeGarantiesFinancières.RawType) => {
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
