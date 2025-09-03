import { CahierDesCharges } from '@potentiel-domain/projet';

import { getGarantiesFinancièresTypeLabel } from '@/app/_helpers';

export const typesGarantiesFinancièresPourFormulaire = (
  cahierDesCharges: CahierDesCharges.ValueType,
) =>
  cahierDesCharges.appelOffre.garantiesFinancières.typeGarantiesFinancièresDisponibles
    .filter((type) => type !== 'type-inconnu')
    .map((type) => ({
      label: getGarantiesFinancièresTypeLabel(type),
      value: type,
    }));
