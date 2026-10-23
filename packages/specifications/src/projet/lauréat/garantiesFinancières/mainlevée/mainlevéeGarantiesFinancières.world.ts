import type { Lauréat } from '@potentiel-domain/projet';

import { mapDateTime, mapToExemple } from '../../../../helpers/mapToExemple.js';
import type { GarantiesFinancièresWorld } from '../garantiesFinancières.world.js';
import { AccorderDemandeMainlevéeFixture } from './fixtures/accorderDemandeMainlevée.fixture.js';
import { AccorderMainlevéeFixture } from './fixtures/accorderMainlevée.fixture.js';
import {
  type CréerDemanderMainlevéeFixtureProps,
  DemanderMainlevéeFixture,
} from './fixtures/demanderMainlevée.fixture.js';
import { PasserMainlevéeEnInstructionFixture } from './fixtures/passerMainlevéeEnInstruction.fixture.js';
import { RejeterMainlevéeFixture } from './fixtures/rejeterMainlevée.fixture.js';

export class MainlevéeGarantiesFinancièresWorld {
  readonly demander: DemanderMainlevéeFixture;
  readonly passerEnInstruction: PasserMainlevéeEnInstructionFixture;
  readonly accorderDemande: AccorderDemandeMainlevéeFixture;
  readonly rejeter: RejeterMainlevéeFixture;
  readonly accorder: AccorderMainlevéeFixture;

  constructor(public readonly garantiesFinancièresWorld: GarantiesFinancièresWorld) {
    this.demander = new DemanderMainlevéeFixture();
    this.passerEnInstruction = new PasserMainlevéeEnInstructionFixture();
    this.accorderDemande = new AccorderDemandeMainlevéeFixture();
    this.rejeter = new RejeterMainlevéeFixture();
    this.accorder = new AccorderMainlevéeFixture();
  }

  mapToExpected(): Partial<Lauréat.GarantiesFinancières.ConsulterMainlevéeEnCoursReadModel> {
    const { identifiantProjet } = this.garantiesFinancièresWorld.lauréatWorld;

    if (!this.demander.aÉtéCréé && !this.accorder.aÉtéCréé) {
      throw new Error(
        `La fixture d'initialisation de la mainlevée n'a pas n'a pas été créée (demande ou accord direct)`,
      );
    }

    return {
      identifiantProjet,
      ...this.demander.mapToExpected(),
      ...this.passerEnInstruction.mapToExpected(),
      ...this.accorderDemande.mapToExpected(identifiantProjet),
      ...this.rejeter.mapToExpected(identifiantProjet),
      ...this.accorder.mapToExpected(identifiantProjet),
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
