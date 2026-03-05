import { Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { EnregistrerGarantiesFinancièresFixture } from './enregistrerGarantiesFinancières.fixture.js';

export class EnregistrerAttestationGarantiesFinancièresFixture extends EnregistrerGarantiesFinancièresFixture {
  mapToExpected(): Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresReadModel {
    const expected = super.mapToExpected();

    const dépôtCandidature =
      this.garantiesFinancièresActuellesWorld.garantiesFinancièresWorld.lauréatWorld
        .candidatureWorld.importerCandidature.dépôtValue;

    return {
      ...expected,
      garantiesFinancières: Lauréat.GarantiesFinancières.GarantiesFinancières.convertirEnValueType({
        dateÉchéance: dépôtCandidature.dateÉchéanceGf,
        type:
          expected.garantiesFinancières.type.formatter() ??
          dépôtCandidature.typeGarantiesFinancières,
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
