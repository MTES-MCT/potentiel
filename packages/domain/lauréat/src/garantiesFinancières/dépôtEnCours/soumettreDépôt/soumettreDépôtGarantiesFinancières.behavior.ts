import { DateTime } from '@potentiel-domain/common';
import { Candidature, Lauréat } from '@potentiel-domain/projet';

import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';
export function applyDépôtGarantiesFinancièresSoumis(
  this: GarantiesFinancièresAggregate,
  {
    payload: { attestation, dateConstitution, soumisLe, type, dateÉchéance },
  }: Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresSoumisEvent,
) {
  this.dépôtsEnCours = {
    dateConstitution: DateTime.convertirEnValueType(dateConstitution),
    soumisLe: DateTime.convertirEnValueType(soumisLe),
    type: Candidature.TypeGarantiesFinancières.convertirEnValueType(type),
    dateÉchéance: dateÉchéance && DateTime.convertirEnValueType(dateÉchéance),
    attestation,
  };
}
