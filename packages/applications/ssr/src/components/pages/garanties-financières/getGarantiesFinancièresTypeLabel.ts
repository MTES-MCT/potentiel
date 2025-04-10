import { Candidature } from '@potentiel-domain/projet';

export const getGarantiesFinancièresTypeLabel = (
  type: Candidature.TypeGarantiesFinancières.RawType,
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
