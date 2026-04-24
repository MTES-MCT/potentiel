import { Lauréat } from '@potentiel-domain/projet';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';

import { EnregistrerChangementProducteurFixture } from './fixture/enregistrerChangementProducteur.fixture.js';
import { ModifierProducteurFixture } from './fixture/modifierProducteur.fixture.js';

export class ProducteurWorld {
  #enregistrerChangementProducteurFixture: EnregistrerChangementProducteurFixture;
  get enregistrerChangementProducteurFixture() {
    return this.#enregistrerChangementProducteurFixture;
  }

  #modifierProducteurFixture: ModifierProducteurFixture;
  get modifierProducteurFixture() {
    return this.#modifierProducteurFixture;
  }

  constructor() {
    this.#enregistrerChangementProducteurFixture = new EnregistrerChangementProducteurFixture();
    this.#modifierProducteurFixture = new ModifierProducteurFixture();
  }

  mapToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
    producteurÀLaCandidature: string,
    numéroImmatriculationÀLaCandidature:
      | Lauréat.Producteur.NuméroImmatriculation.RawType
      | undefined,
  ) {
    const référencielFixture = this.#modifierProducteurFixture.aÉtéCréé
      ? this.#modifierProducteurFixture
      : this.#enregistrerChangementProducteurFixture.aÉtéCréé
        ? this.#enregistrerChangementProducteurFixture
        : undefined;

    const numéro = référencielFixture
      ? { siret: référencielFixture.siret }
      : numéroImmatriculationÀLaCandidature;

    const expected: Lauréat.Producteur.ConsulterProducteurReadModel = {
      identifiantProjet,
      producteur: référencielFixture ? référencielFixture.producteur : producteurÀLaCandidature,
      numéroImmatriculation: numéro
        ? Lauréat.Producteur.NuméroImmatriculation.convertirEnValueType(numéro)
        : undefined,
    };

    return expected;
  }

  mapChangementToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
    ancienProducteur: string,
  ) {
    if (!this.#enregistrerChangementProducteurFixture.aÉtéCréé) {
      throw new Error(`Aucune information enregistrée n'a été créée dans ProducteurWorld`);
    }

    const expected: Lauréat.Producteur.ConsulterChangementProducteurReadModel = {
      identifiantProjet,
      changement: {
        enregistréLe: DateTime.convertirEnValueType(
          this.#enregistrerChangementProducteurFixture.enregistréLe,
        ),
        enregistréPar: Email.convertirEnValueType(
          this.#enregistrerChangementProducteurFixture.enregistréPar,
        ),
        nouveauProducteur: this.#enregistrerChangementProducteurFixture.producteur,
        ancienProducteur,
        pièceJustificative: Lauréat.Producteur.DocumentProducteur.pièceJustificative({
          identifiantProjet: identifiantProjet.formatter(),
          enregistréLe: this.#enregistrerChangementProducteurFixture.enregistréLe,
          pièceJustificative: this.#enregistrerChangementProducteurFixture.pièceJustificative,
        }),
        raison: undefined,
      },
    };

    return expected;
  }
}
