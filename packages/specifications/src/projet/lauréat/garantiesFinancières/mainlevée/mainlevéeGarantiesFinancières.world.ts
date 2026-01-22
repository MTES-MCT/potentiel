import { Lauréat } from '@potentiel-domain/projet';

import { mapDateTime, mapToExemple } from '../../../../helpers/mapToExemple.js';
import { GarantiesFinancièresWorld } from '../garantiesFinancières.world.js';

import {
  CréerDemanderMainlevéeFixtureProps,
  DemanderMainlevéeFixture,
} from './fixtures/demanderMainlevée.fixture.js';
import { PasserMainlevéeEnInstructionFixture } from './fixtures/passerMainlevéeEnInstruction.fixture.js';
import { AccorderMainlevéeFixture } from './fixtures/accorderMainlevée.fixture.js';
import { RejeterMainlevéeFixture } from './fixtures/rejeterMainlevée.fixture.js';

export class MainlevéeGarantiesFinancièresWorld {
  readonly demander: DemanderMainlevéeFixture;
  readonly passerEnInstruction: PasserMainlevéeEnInstructionFixture;
  readonly accorder: AccorderMainlevéeFixture;
  readonly rejeter: RejeterMainlevéeFixture;

  constructor(public readonly garantiesFinancièresWorld: GarantiesFinancièresWorld) {
    this.demander = new DemanderMainlevéeFixture();
    this.passerEnInstruction = new PasserMainlevéeEnInstructionFixture();
    this.accorder = new AccorderMainlevéeFixture();
    this.rejeter = new RejeterMainlevéeFixture();
  }

  mapToExpected(): Lauréat.GarantiesFinancières.ConsulterMainlevéeEnCoursReadModel {
    const { identifiantProjet } = this.garantiesFinancièresWorld.lauréatWorld;
    return {
      identifiantProjet,
      ...this.demander.mapToExpected(),
      ...this.passerEnInstruction.mapToExpected(),
      ...this.accorder.mapToExpected(identifiantProjet),
      ...this.rejeter.mapToExpected(identifiantProjet),
    };
  }

  mapToExemple(exemple: Record<string, string>) {
    return mapToExemple<CréerDemanderMainlevéeFixtureProps>(exemple, {
      demandéLe: ['date demande', mapDateTime],
      motif: ['motif'],
      demandéPar: ['utilisateur'],
    });
  }
}
