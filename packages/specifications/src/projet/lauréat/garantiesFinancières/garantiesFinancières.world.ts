import { LauréatWorld } from '../lauréat.world';

import { GarantiesFinancièresActuellesWorld } from './actuelles/garantiesFinancièresActuelles.world';

export class GarantiesFinancièresWorld {
  readonly actuelles: GarantiesFinancièresActuellesWorld;
  constructor(public readonly lauréatWorld: LauréatWorld) {
    this.actuelles = new GarantiesFinancièresActuellesWorld(this);
  }

  mapToExpected() {}
}
