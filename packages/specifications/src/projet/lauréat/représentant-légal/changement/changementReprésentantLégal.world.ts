import { DateTime, Email } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { ReprésentantLégalWorld } from '../représentantLégal.world.js';

import { AnnulerChangementReprésentantLégalFixture } from './fixtures/annulerChangementReprésentantLégal.fixture.js';
import { AccorderChangementReprésentantLégalFixture } from './fixtures/accorderChangementReprésentantLégal.fixture.js';
import { RejeterChangementReprésentantLégalFixture } from './fixtures/rejeterChangementReprésentantLégal.fixture.js';
import { DemanderChangementReprésentantLégalFixture } from './fixtures/demanderChangementReprésentantLégal.fixture.js';
import { CorrigerChangementReprésentantLégalFixture } from './fixtures/corrigerChangementReprésentantLégal.fixture.js';

export class ChangementReprésentantLégalWorld {
  #demanderOuEnregistrerChangementReprésentantLégalFixture: DemanderChangementReprésentantLégalFixture;
  get demanderOuEnregistrerChangementReprésentantLégalFixture() {
    return this.#demanderOuEnregistrerChangementReprésentantLégalFixture;
  }

  #annulerChangementReprésentantLégalFixture: AnnulerChangementReprésentantLégalFixture;
  get annulerChangementReprésentantLégalFixture() {
    return this.#annulerChangementReprésentantLégalFixture;
  }

  #corrigerChangementReprésentantLégalFixture: CorrigerChangementReprésentantLégalFixture;
  get corrigerChangementReprésentantLégalFixture() {
    return this.#corrigerChangementReprésentantLégalFixture;
  }

  #accorderChangementReprésentantLégalFixture: AccorderChangementReprésentantLégalFixture;
  get accorderChangementReprésentantLégalFixture() {
    return this.#accorderChangementReprésentantLégalFixture;
  }

  #rejeterChangementReprésentantLégalFixture: RejeterChangementReprésentantLégalFixture;
  get rejeterChangementReprésentantLégalFixture() {
    return this.#rejeterChangementReprésentantLégalFixture;
  }

  constructor(public readonly représentantLégalWorld: ReprésentantLégalWorld) {
    this.#demanderOuEnregistrerChangementReprésentantLégalFixture =
      new DemanderChangementReprésentantLégalFixture();
    this.#annulerChangementReprésentantLégalFixture =
      new AnnulerChangementReprésentantLégalFixture();
    this.#corrigerChangementReprésentantLégalFixture =
      new CorrigerChangementReprésentantLégalFixture();
    this.#accorderChangementReprésentantLégalFixture =
      new AccorderChangementReprésentantLégalFixture();
    this.#rejeterChangementReprésentantLégalFixture =
      new RejeterChangementReprésentantLégalFixture();
  }

  mapToExpected(): Lauréat.ReprésentantLégal.ConsulterChangementReprésentantLégalReadModel {
    const expectedStatut = this.annulerChangementReprésentantLégalFixture.aÉtéCréé
      ? Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.annulé
      : this.accorderChangementReprésentantLégalFixture.aÉtéCréé
        ? Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.accordé
        : this.rejeterChangementReprésentantLégalFixture.aÉtéCréé
          ? Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.rejeté
          : this.demanderOuEnregistrerChangementReprésentantLégalFixture.statut;

    const identifiantProjet = this.représentantLégalWorld.lauréatWorld.identifiantProjet;
    const expected: Lauréat.ReprésentantLégal.ConsulterChangementReprésentantLégalReadModel = {
      identifiantProjet,
      demande: {
        statut: expectedStatut,
        nomReprésentantLégal:
          this.#demanderOuEnregistrerChangementReprésentantLégalFixture.nomReprésentantLégal,
        typeReprésentantLégal:
          this.#demanderOuEnregistrerChangementReprésentantLégalFixture.typeReprésentantLégal,
        demandéeLe: DateTime.convertirEnValueType(
          this.#demanderOuEnregistrerChangementReprésentantLégalFixture.demandéLe,
        ),
        demandéePar: Email.convertirEnValueType(
          this.#demanderOuEnregistrerChangementReprésentantLégalFixture.demandéPar,
        ),
        pièceJustificative:
          Lauréat.ReprésentantLégal.DocumentChangementReprésentantLégal.pièceJustificative({
            identifiantProjet: identifiantProjet.formatter(),
            enregistréeLe: this.#demanderOuEnregistrerChangementReprésentantLégalFixture.demandéLe,
            pièceJustificative: {
              format:
                this.#demanderOuEnregistrerChangementReprésentantLégalFixture.pièceJustificative!
                  .format,
            },
          }),
      },
    };

    if (this.corrigerChangementReprésentantLégalFixture.aÉtéCréé) {
      expected.demande.nomReprésentantLégal =
        this.corrigerChangementReprésentantLégalFixture.nomReprésentantLégal;
      expected.demande.typeReprésentantLégal =
        this.corrigerChangementReprésentantLégalFixture.typeReprésentantLégal;
      expected.demande.pièceJustificative =
        Lauréat.ReprésentantLégal.DocumentChangementReprésentantLégal.pièceJustificative({
          identifiantProjet: identifiantProjet.formatter(),
          enregistréeLe: this.#demanderOuEnregistrerChangementReprésentantLégalFixture.demandéLe,
          pièceJustificative: {
            format: this.#corrigerChangementReprésentantLégalFixture.pièceJustificative!.format,
          },
        });
    }

    if (this.accorderChangementReprésentantLégalFixture.aÉtéCréé) {
      expected.demande.accord = {
        nomReprésentantLégal: this.accorderChangementReprésentantLégalFixture.nomReprésentantLégal,
        typeReprésentantLégal:
          this.accorderChangementReprésentantLégalFixture.typeReprésentantLégal,
        accordéeLe: DateTime.convertirEnValueType(
          this.accorderChangementReprésentantLégalFixture.accordéeLe,
        ),
        accordéePar: Email.convertirEnValueType(
          this.accorderChangementReprésentantLégalFixture.accordéePar,
        ),
      };
    }

    if (this.rejeterChangementReprésentantLégalFixture.aÉtéCréé) {
      expected.demande.rejet = {
        motif: this.rejeterChangementReprésentantLégalFixture.motif,
        rejetéeLe: DateTime.convertirEnValueType(
          this.rejeterChangementReprésentantLégalFixture.rejetéLe,
        ),
        rejetéePar: Email.convertirEnValueType(
          this.rejeterChangementReprésentantLégalFixture.rejetéPar,
        ),
      };
    }

    return expected;
  }
}
