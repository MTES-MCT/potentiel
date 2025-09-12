import { LauréatWorld } from '../lauréat.world';

import { GarantiesFinancièresActuellesWorld } from './actuelles/garantiesFinancièresActuelles.world';
import { DépôtGarantiesFinancièresWorld } from './dépôt/dépôtGarantiesFinancières.world';
import { MainlevéeGarantiesFinancièresWorld } from './mainlevée/mainlevéeGarantiesFinancières.world';

export class GarantiesFinancièresWorld {
  readonly actuelles: GarantiesFinancièresActuellesWorld;
  readonly dépôt: DépôtGarantiesFinancièresWorld;
  readonly mainlevée: MainlevéeGarantiesFinancièresWorld;
  constructor(public readonly lauréatWorld: LauréatWorld) {
    this.actuelles = new GarantiesFinancièresActuellesWorld(this);
    this.dépôt = new DépôtGarantiesFinancièresWorld(this);
    this.mainlevée = new MainlevéeGarantiesFinancièresWorld(this);
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
