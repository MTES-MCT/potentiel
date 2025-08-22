import { DateTime } from '@potentiel-domain/common';
import { Candidature, type Lauréat } from '@potentiel-domain/projet';

import { StatutGarantiesFinancières } from '../..';
import type { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';

export function applyModifierGarantiesFinancières(
  this: GarantiesFinancièresAggregate,
  {
    payload: { type, dateÉchéance, dateConstitution, attestation },
  }: Lauréat.GarantiesFinancières.GarantiesFinancièresModifiéesEvent,
) {
  this.actuelles = {
    statut: StatutGarantiesFinancières.validé,
    ...this.actuelles,
    type: Candidature.TypeGarantiesFinancières.convertirEnValueType(type),
    dateÉchéance: dateÉchéance && DateTime.convertirEnValueType(dateÉchéance),
    dateConstitution: DateTime.convertirEnValueType(dateConstitution),
    attestation,
  };
}
