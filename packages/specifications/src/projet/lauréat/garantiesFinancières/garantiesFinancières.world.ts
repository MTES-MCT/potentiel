import { LauréatWorld } from '../lauréat.world';

import { GarantiesFinancièresActuellesWorld } from './actuelles/garantiesFinancièresActuelles.world';
import { DépôtGarantiesFinancièresWorld } from './dépôt/dépôtGarantiesFinancières.world';

export class GarantiesFinancièresWorld {
  readonly actuelles: GarantiesFinancièresActuellesWorld;
  readonly dépôt: DépôtGarantiesFinancièresWorld;
  constructor(public readonly lauréatWorld: LauréatWorld) {
    this.actuelles = new GarantiesFinancièresActuellesWorld(this);
    this.dépôt = new DépôtGarantiesFinancièresWorld(this);
  }

  mapToExpected() {
    if (this.dépôt.valider.aÉtéCréé) {
      return this.dépôt.mapToExpected();
    }
    return this.actuelles.mapToExpected();
  }
  mapToAttestation() {
    if (this.dépôt.valider.aÉtéCréé) {
      return this.dépôt.mapToAttestation();
    }
    return this.actuelles.mapToAttestation();
  }
}
