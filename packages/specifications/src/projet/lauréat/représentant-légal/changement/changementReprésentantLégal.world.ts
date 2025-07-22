import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { AnnulerChangementReprésentantLégalFixture } from './fixtures/annulerChangementReprésentantLégal.fixture';
import { AccorderChangementReprésentantLégalFixture } from './fixtures/accorderChangementReprésentantLégal.fixture';
import { RejeterChangementReprésentantLégalFixture } from './fixtures/rejeterChangementReprésentantLégal.fixture';
import { DemanderChangementReprésentantLégalFixture } from './fixtures/demanderChangementReprésentantLégal.fixture';
import { CorrigerChangementReprésentantLégalFixture } from './fixtures/corrigerChangementReprésentantLégal.fixture';

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

  constructor() {
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

  mapToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
    statut?: Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.ValueType,
  ): Lauréat.ReprésentantLégal.ConsulterChangementReprésentantLégalReadModel {
    const expected: Lauréat.ReprésentantLégal.ConsulterChangementReprésentantLégalReadModel = {
      identifiantProjet,
      demande: {
        statut: statut ?? this.#demanderOuEnregistrerChangementReprésentantLégalFixture.statut,
        nomReprésentantLégal:
          this.#demanderOuEnregistrerChangementReprésentantLégalFixture.nomReprésentantLégal,
        typeReprésentantLégal:
          this.#demanderOuEnregistrerChangementReprésentantLégalFixture.typeReprésentantLégal,
        demandéLe: DateTime.convertirEnValueType(
          this.#demanderOuEnregistrerChangementReprésentantLégalFixture.demandéLe,
        ),
        demandéPar: Email.convertirEnValueType(
          this.#demanderOuEnregistrerChangementReprésentantLégalFixture.demandéPar,
        ),
        pièceJustificative: DocumentProjet.convertirEnValueType(
          identifiantProjet.formatter(),
          Lauréat.ReprésentantLégal.TypeDocumentChangementReprésentantLégal.pièceJustificative.formatter(),
          this.#demanderOuEnregistrerChangementReprésentantLégalFixture.demandéLe,
          this.#demanderOuEnregistrerChangementReprésentantLégalFixture.pièceJustificative!.format,
        ),
      },
    };

    if (this.corrigerChangementReprésentantLégalFixture.aÉtéCréé) {
      expected.demande.nomReprésentantLégal =
        this.corrigerChangementReprésentantLégalFixture.nomReprésentantLégal;
      expected.demande.typeReprésentantLégal =
        this.corrigerChangementReprésentantLégalFixture.typeReprésentantLégal;
      expected.demande.pièceJustificative = DocumentProjet.convertirEnValueType(
        identifiantProjet.formatter(),
        Lauréat.ReprésentantLégal.TypeDocumentChangementReprésentantLégal.pièceJustificative.formatter(),
        this.#demanderOuEnregistrerChangementReprésentantLégalFixture.demandéLe,
        this.#corrigerChangementReprésentantLégalFixture.pièceJustificative!.format,
      );
    }

    if (this.accorderChangementReprésentantLégalFixture.aÉtéCréé) {
      expected.demande.accord = {
        nomReprésentantLégal: this.accorderChangementReprésentantLégalFixture.nomReprésentantLégal,
        typeReprésentantLégal:
          this.accorderChangementReprésentantLégalFixture.typeReprésentantLégal,
        accordéLe: DateTime.convertirEnValueType(
          this.accorderChangementReprésentantLégalFixture.accordéeLe,
        ),
        accordéPar: Email.convertirEnValueType(
          this.accorderChangementReprésentantLégalFixture.accordéePar,
        ),
      };
    }

    if (this.rejeterChangementReprésentantLégalFixture.aÉtéCréé) {
      expected.demande.rejet = {
        motif: this.rejeterChangementReprésentantLégalFixture.motif,
        rejetéLe: DateTime.convertirEnValueType(
          this.rejeterChangementReprésentantLégalFixture.rejetéLe,
        ),
        rejetéPar: Email.convertirEnValueType(
          this.rejeterChangementReprésentantLégalFixture.rejetéPar,
        ),
      };
    }

    return expected;
  }
}
