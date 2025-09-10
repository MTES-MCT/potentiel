import { Lauréat } from '@potentiel-domain/projet';

import { mapDateTime, mapToExemple } from '../../../../helpers/mapToExemple';
import { GarantiesFinancièresWorld } from '../garantiesFinancières.world';

import {
  CréerDemanderMainlevéeFixtureProps,
  DemanderMainlevéeFixture,
} from './fixtures/demanderMainlevée.fixture';
import { PasserMainlevéeEnInstructionFixture } from './fixtures/passerMainlevéeEnInstruction.fixture';
import { AccorderMainlevéeFixture } from './fixtures/accorderMainlevée.fixture';
import { RejeterMainlevéeFixture } from './fixtures/rejeterMainlevée.fixture';

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

  mapToExpected(): Lauréat.GarantiesFinancières.ListerMainlevéesReadModel {
    const { identifiantProjet } = this.garantiesFinancièresWorld.lauréatWorld;
    const { nomProjet } = this.garantiesFinancièresWorld.lauréatWorld.mapToExpected();
    const mainlevée: Lauréat.GarantiesFinancières.ListerMainlevéesReadModel['items'][number] = {
      identifiantProjet,
      nomProjet,
      appelOffre: identifiantProjet.appelOffre,
      ...this.demander.mapToExpected(),
      ...this.passerEnInstruction.mapToExpected(),
      ...this.accorder.mapToExpected(identifiantProjet),
      ...this.rejeter.mapToExpected(identifiantProjet),
    };

    return {
      items: [mainlevée],
      range: { startPosition: 0, endPosition: 1 },
      total: 1,
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
