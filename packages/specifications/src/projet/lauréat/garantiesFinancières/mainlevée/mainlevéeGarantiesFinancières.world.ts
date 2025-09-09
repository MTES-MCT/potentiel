import { Lauréat } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';

import { mapDateTime, mapToExemple } from '../../../../helpers/mapToExemple';
import { GarantiesFinancièresWorld } from '../garantiesFinancières.world';

import {
  CréerDemanderMainlevéeFixtureProps,
  DemanderMainlevéeFixture,
} from './fixtures/demanderMainlevée.fixture';

export class MainlevéeGarantiesFinancièresWorld {
  readonly demander: DemanderMainlevéeFixture;

  constructor(public readonly garantiesFinancièresWorld: GarantiesFinancièresWorld) {
    this.demander = new DemanderMainlevéeFixture();
  }

  mapToExpected(): Lauréat.GarantiesFinancières.ListerMainlevéesReadModel {
    const { identifiantProjet } = this.garantiesFinancièresWorld.lauréatWorld;
    const { nomProjet } = this.garantiesFinancièresWorld.lauréatWorld.mapToExpected();
    return {
      items: [
        {
          identifiantProjet,
          nomProjet,
          appelOffre: identifiantProjet.appelOffre,
          statut: Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.demandé,
          demande: {
            demandéeLe: DateTime.convertirEnValueType(this.demander.demandéLe),
            demandéePar: Email.convertirEnValueType(this.demander.demandéPar),
          },
          motif:
            Lauréat.GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.convertirEnValueType(
              this.demander.motif,
            ),
          dernièreMiseÀJour: {
            date: DateTime.convertirEnValueType(this.demander.demandéLe),
            par: Email.convertirEnValueType(this.demander.demandéPar),
          },
          accord: undefined,
          instruction: undefined,
          rejet: undefined,
        },
      ],
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
