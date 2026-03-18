import { Lauréat } from '@potentiel-domain/projet';

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
        constitution: expected.garantiesFinancières.constitution
          ? {
              attestation: expected.garantiesFinancières.constitution.attestation,
              date: expected.garantiesFinancières.constitution.date.formatter(),
            }
          : undefined,
      }),
    };
  }
}
