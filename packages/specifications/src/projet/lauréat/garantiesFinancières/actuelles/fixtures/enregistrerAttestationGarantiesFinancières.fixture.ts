import { Lauréat } from '@potentiel-domain/projet';

import { EnregistrerGarantiesFinancièresFixture } from './enregistrerGarantiesFinancières.fixture';

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
        dateDélibération: dépôtCandidature.dateDélibérationGf,
      }),
    };
  }
}
