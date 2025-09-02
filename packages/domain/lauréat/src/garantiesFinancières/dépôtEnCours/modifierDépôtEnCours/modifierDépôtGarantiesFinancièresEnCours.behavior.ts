import { DateTime } from '@potentiel-domain/common';
import { Candidature, Lauréat } from '@potentiel-domain/projet';

import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';

export function applyDépôtGarantiesFinancièresEnCoursModifié(
  this: GarantiesFinancièresAggregate,
  {
    payload: { type, dateÉchéance, dateConstitution, modifiéLe, attestation },
  }: Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursModifiéEvent,
) {
  this.dépôtsEnCours = {
    dateConstitution: DateTime.convertirEnValueType(dateConstitution),
    soumisLe: DateTime.convertirEnValueType(modifiéLe),
    type: Candidature.TypeGarantiesFinancières.convertirEnValueType(type),
    ...(dateÉchéance && { dateÉchéance: DateTime.convertirEnValueType(dateÉchéance) }),
    attestation,
  };
}
