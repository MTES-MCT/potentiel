import { Candidature } from '@potentiel-domain/projet';

import { getGarantiesFinancièresTypeLabel } from '@/app/_helpers';

export const typesGarantiesFinancièresSansInconnuPourFormulaire =
  Candidature.TypeGarantiesFinancières.types
    .filter((type) => type !== 'type-inconnu')
    .map((type) => ({
      label: getGarantiesFinancièresTypeLabel(type),
      value: type,
    }));
