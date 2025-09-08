import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';
import { Candidature } from '@potentiel-domain/projet';

import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';

export function applyModifierGarantiesFinancières(
  this: GarantiesFinancièresAggregate,
  {
    payload: { type, dateÉchéance, dateConstitution, attestation },
  }: Lauréat.GarantiesFinancières.GarantiesFinancièresModifiéesEvent,
) {
  this.actuelles = {
    statut: Lauréat.GarantiesFinancières.StatutGarantiesFinancières.validé,
    ...this.actuelles,
    type: Candidature.TypeGarantiesFinancières.convertirEnValueType(type),
    dateÉchéance: dateÉchéance && DateTime.convertirEnValueType(dateÉchéance),
    dateConstitution: DateTime.convertirEnValueType(dateConstitution),
    attestation,
  };
}
