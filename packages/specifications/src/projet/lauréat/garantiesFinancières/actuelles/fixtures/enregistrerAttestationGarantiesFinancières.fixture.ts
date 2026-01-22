import { Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { EnregistrerGarantiesFinancièresFixture } from './enregistrerGarantiesFinancières.fixture.js';

export class EnregistrerAttestationGarantiesFinancièresFixture extends EnregistrerGarantiesFinancièresFixture {
  mapToExpected() {
    const expected = super.mapToExpected();

    const dépôtCandidature =
      this.garantiesFinancièresActuellesWorld.garantiesFinancièresWorld.lauréatWorld
        .candidatureWorld.importerCandidature.dépôtValue;

    return {
      ...expected,
      garantiesFinancières: Lauréat.GarantiesFinancières.GarantiesFinancières.convertirEnValueType({
        type: dépôtCandidature.typeGarantiesFinancières!,
        dateÉchéance: dépôtCandidature.dateÉchéanceGf,
        attestation:
          expected.garantiesFinancières.constitution?.attestation ??
          dépôtCandidature.attestationConstitutionGf,
        dateConstitution: expected.garantiesFinancières.constitution?.date
          ? DateTime.convertirEnValueType(
              expected.garantiesFinancières.constitution?.date.date,
            ).formatter()
          : dépôtCandidature.dateConstitutionGf,
      }),
    };
  }
}
