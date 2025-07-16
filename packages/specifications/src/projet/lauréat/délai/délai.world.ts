import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { DemanderDélaiFixture } from './fixtures/demanderDélai.fixture';
import { AnnulerDemandeDélaiFixture } from './fixtures/annulerDemandeDélai.fixture';
import { RejeterDemandeDélaiFixture } from './fixtures/rejeterDemandeDélai.fixture';
import { PasserEnInstructionDemandeDélaiFixture } from './fixtures/passerEnInstructionDemandeDélai.fixture';
import { AccorderDemandeDélaiFixture } from './fixtures/accorderDemandeDélai.fixture';

export class DélaiWorld {
  readonly #demanderDélaiFixture: DemanderDélaiFixture = new DemanderDélaiFixture();

  get demanderDélaiFixture() {
    return this.#demanderDélaiFixture;
  }

  readonly #annulerDemandeDélaiFixture: AnnulerDemandeDélaiFixture =
    new AnnulerDemandeDélaiFixture();

  get annulerDélaiFixture() {
    return this.#annulerDemandeDélaiFixture;
  }

  readonly #passerEnInstructionDemandeDélaiFixture: PasserEnInstructionDemandeDélaiFixture =
    new PasserEnInstructionDemandeDélaiFixture();

  get passerEnInstructionDemandeDélaiFixture() {
    return this.#passerEnInstructionDemandeDélaiFixture;
  }

  readonly #rejeterDemandeDélaiFixture: RejeterDemandeDélaiFixture =
    new RejeterDemandeDélaiFixture();

  get rejeterDemandeDélaiFixture() {
    return this.#rejeterDemandeDélaiFixture;
  }

  readonly #accorderDemandeDélaiFixture: AccorderDemandeDélaiFixture =
    new AccorderDemandeDélaiFixture();

  get accorderDemandeDélaiFixture() {
    return this.#accorderDemandeDélaiFixture;
  }

  mapToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
    statut: Lauréat.Délai.StatutDemandeDélai.ValueType,
  ): Lauréat.Délai.ConsulterDemandeDélaiReadModel {
    if (!this.#demanderDélaiFixture.aÉtéCréé) {
      throw new Error(`Aucune demande de délai n'a été créée dans DélaiWorld`);
    }

    const expected: Lauréat.Délai.ConsulterDemandeDélaiReadModel = {
      statut,
      identifiantProjet,
      demandéLe: DateTime.convertirEnValueType(this.#demanderDélaiFixture.demandéLe),
      demandéPar: Email.convertirEnValueType(this.#demanderDélaiFixture.demandéPar),
      nombreDeMois: this.#demanderDélaiFixture.nombreDeMois,
      raison: this.#demanderDélaiFixture.raison,
      pièceJustificative: DocumentProjet.convertirEnValueType(
        identifiantProjet.formatter(),
        Lauréat.Délai.TypeDocumentDemandeDélai.pièceJustificative.formatter(),
        this.#demanderDélaiFixture.demandéLe,
        this.#demanderDélaiFixture.pièceJustificative.format,
      ),

      instruction: this.#passerEnInstructionDemandeDélaiFixture.aÉtéCréé
        ? {
            passéeEnInstructionLe: DateTime.convertirEnValueType(
              this.#passerEnInstructionDemandeDélaiFixture.passéeEnInstructionLe,
            ),
            passéeEnInstructionPar: Email.convertirEnValueType(
              this.#passerEnInstructionDemandeDélaiFixture.passéeEnInstructionPar,
            ),
          }
        : undefined,

      rejet: this.#rejeterDemandeDélaiFixture.aÉtéCréé
        ? {
            rejetéeLe: DateTime.convertirEnValueType(this.#rejeterDemandeDélaiFixture.rejetéeLe),
            rejetéePar: Email.convertirEnValueType(this.#rejeterDemandeDélaiFixture.rejetéePar),

            réponseSignée: DocumentProjet.convertirEnValueType(
              identifiantProjet.formatter(),
              Lauréat.Délai.TypeDocumentDemandeDélai.demandeRejetée.formatter(),
              DateTime.convertirEnValueType(this.#rejeterDemandeDélaiFixture.rejetéeLe).formatter(),
              this.#rejeterDemandeDélaiFixture.réponseSignée.format,
            ),
          }
        : undefined,

      accord: this.#accorderDemandeDélaiFixture.aÉtéCréé
        ? {
            accordéeLe: DateTime.convertirEnValueType(this.#accorderDemandeDélaiFixture.accordéeLe),
            accordéePar: Email.convertirEnValueType(this.#accorderDemandeDélaiFixture.accordéePar),
            nombreDeMois: this.#demanderDélaiFixture.nombreDeMois,
            réponseSignée: DocumentProjet.convertirEnValueType(
              identifiantProjet.formatter(),
              Lauréat.Délai.TypeDocumentDemandeDélai.demandeAccordée.formatter(),
              DateTime.convertirEnValueType(
                this.#accorderDemandeDélaiFixture.accordéeLe,
              ).formatter(),
              this.#accorderDemandeDélaiFixture.réponseSignée.format,
            ),
          }
        : undefined,
    };

    return expected;
  }
}
