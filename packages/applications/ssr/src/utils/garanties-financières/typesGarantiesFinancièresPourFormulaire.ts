import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { getGarantiesFinancièresTypeLabel } from '@/components/pages/garanties-financières/getGarantiesFinancièresTypeLabel';

export const typesGarantiesFinancièresSansInconnuPourFormulaire =
  GarantiesFinancières.TypeGarantiesFinancières.types
    .filter((type) => type !== 'type-inconnu')
    .map((type) => ({
      label: getGarantiesFinancièresTypeLabel(type),
      value: type,
    }));
