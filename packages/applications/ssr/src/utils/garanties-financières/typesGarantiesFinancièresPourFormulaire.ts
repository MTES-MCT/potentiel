import { TypeGarantiesFinancières } from '@potentiel-domain/common';

import { getGarantiesFinancièresTypeLabel } from '@/components/pages/garanties-financières/getGarantiesFinancièresTypeLabel';

export const typesGarantiesFinancièresSansInconnuPourFormulaire = TypeGarantiesFinancières.types
  .filter((type) => type !== 'type-inconnu')
  .map((type) => ({
    label: getGarantiesFinancièresTypeLabel(type),
    value: type,
  }));
