import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { DemanderDélaiFixture } from './fixtures/demanderDélai.fixture';

export class DélaiWorld {
  readonly #demanderDélaiFixture: DemanderDélaiFixture = new DemanderDélaiFixture();

  get demanderDélaiFixture() {
    return this.#demanderDélaiFixture;
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
      pièceJustificative: DocumentProjet.convertirEnValueType(
        identifiantProjet.formatter(),
        Lauréat.Délai.TypeDocumentDemandeDélai.pièceJustificative.formatter(),
        this.#demanderDélaiFixture.demandéLe,
        this.#demanderDélaiFixture.pièceJustificative.format,
      ),
    };

    return expected;
  }
}
