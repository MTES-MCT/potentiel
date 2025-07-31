import { Candidature } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { EnregistrerGarantiesFinancièresFixture } from './enregistrerGarantiesFinancières.fixture';

export class EnregistrerAttestationGarantiesFinancièresFixture extends EnregistrerGarantiesFinancièresFixture {
  mapToExpected() {
    const expected = super.mapToExpected();

    const dépôtCandidature =
      this.garantiesFinancièresActuellesWorld.garantiesFinancièresWorld.lauréatWorld
        .candidatureWorld.importerCandidature.dépôtValue;
    return {
      ...expected,
      type: Candidature.TypeGarantiesFinancières.convertirEnValueType(
        dépôtCandidature.typeGarantiesFinancières!,
      ),
      dateÉchéance: dépôtCandidature.dateÉchéanceGf
        ? DateTime.convertirEnValueType(dépôtCandidature.dateÉchéanceGf)
        : undefined,
    };
  }
}
