import { CahierDesCharges } from '@potentiel-domain/projet';

import { getGarantiesFinancièresTypeLabel } from './_helpers/getGarantiesFinancièresTypeLabel';

export const typesGarantiesFinancièresPourFormulaire = (
  cahierDesCharges: CahierDesCharges.ValueType,
) =>
  cahierDesCharges.appelOffre.garantiesFinancières.typeGarantiesFinancièresDisponibles
    .filter((type) => type !== 'type-inconnu')
    .map((type) => ({
      label: getGarantiesFinancièresTypeLabel(type),
      value: type,
    }));
