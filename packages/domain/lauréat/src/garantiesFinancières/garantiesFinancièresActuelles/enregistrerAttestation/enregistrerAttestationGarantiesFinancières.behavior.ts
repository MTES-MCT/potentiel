import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';

export function applyEnregistrerAttestationGarantiesFinancières(
  this: GarantiesFinancièresAggregate,
  {
    payload: { dateConstitution, attestation },
  }: Lauréat.GarantiesFinancières.AttestationGarantiesFinancièresEnregistréeEvent,
) {
  this.actuelles = {
    ...this.actuelles!,
    dateConstitution: DateTime.convertirEnValueType(dateConstitution),
    attestation,
  };
}
