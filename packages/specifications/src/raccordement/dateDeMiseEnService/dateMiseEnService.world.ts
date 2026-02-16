import { RaccordementWorld } from '../raccordement.world.js';

import { ModifierDateMiseEnServiceFixture } from './fixtures/modifierDateDeMiseEnService.fixture.js';
import { TransmettreDateMiseEnServiceFixture } from './fixtures/transmettreDateDeMiseEnService.fixture.js';

export class DateMiseEnServiceWorld {
  readonly transmettreFixture: TransmettreDateMiseEnServiceFixture;
  readonly modifierFixture: ModifierDateMiseEnServiceFixture;

  constructor(public raccordementWorld: RaccordementWorld) {
    this.transmettreFixture = new TransmettreDateMiseEnServiceFixture(raccordementWorld);
    this.modifierFixture = new ModifierDateMiseEnServiceFixture(raccordementWorld);
  }

  mapToExpected() {
    return this.modifierFixture.mapToExpected() ?? this.transmettreFixture.mapToExpected();
  }
}
