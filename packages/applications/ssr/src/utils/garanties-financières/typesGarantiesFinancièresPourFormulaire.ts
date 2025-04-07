import { Candidature } from '@potentiel-domain/projet';

import { getGarantiesFinancièresTypeLabel } from '@/components/pages/garanties-financières/getGarantiesFinancièresTypeLabel';

export const typesGarantiesFinancièresSansInconnuPourFormulaire =
  Candidature.TypeGarantiesFinancières.types
    .filter((type) => type !== 'type-inconnu')
    .map((type) => ({
      label: getGarantiesFinancièresTypeLabel(type),
      value: type,
    }));
