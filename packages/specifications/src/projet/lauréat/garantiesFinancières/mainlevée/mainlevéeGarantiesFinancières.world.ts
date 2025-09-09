import { Lauréat } from '@potentiel-domain/projet';

import { mapDateTime, mapToExemple } from '../../../../helpers/mapToExemple';
import { GarantiesFinancièresWorld } from '../garantiesFinancières.world';

import {
  CréerDemanderMainlevéeFixtureProps,
  DemanderMainlevéeFixture,
} from './fixtures/demanderMainlevée.fixture';
import { PasserMainlevéeEnInstructionFixture } from './fixtures/passerMainlevéeEnInstruction.fixture';

export class MainlevéeGarantiesFinancièresWorld {
  readonly demander: DemanderMainlevéeFixture;
  readonly passerEnInstruction: PasserMainlevéeEnInstructionFixture;

  constructor(public readonly garantiesFinancièresWorld: GarantiesFinancièresWorld) {
    this.demander = new DemanderMainlevéeFixture();
    this.passerEnInstruction = new PasserMainlevéeEnInstructionFixture();
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
      accord: undefined,
      rejet: undefined,
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
