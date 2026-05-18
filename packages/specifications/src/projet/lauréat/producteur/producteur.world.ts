import { DateTime, Email } from '@potentiel-domain/common';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { mapToExemple } from '#helpers';

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

  mapExempleToFixtureValues(exemple: Record<string, string>) {
    return mapToExemple<{ producteur: string; siret: string }>(exemple, {
      producteur: ['producteur'],
      siret: ['siret'],
    });
  }

  mapToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
    producteurÀLaCandidature: string,
    numéroIdentificationÀLaCandidature: Lauréat.Producteur.NuméroIdentification.RawType | undefined,
  ) {
    const référencielFixture = this.#modifierProducteurFixture.aÉtéCréé
      ? this.#modifierProducteurFixture
      : this.#enregistrerChangementProducteurFixture.aÉtéCréé
        ? this.#enregistrerChangementProducteurFixture
        : undefined;

    const numéro = référencielFixture
      ? { siret: référencielFixture.siret }
      : numéroIdentificationÀLaCandidature;

    const expected: Lauréat.Producteur.ConsulterProducteurReadModel = {
      identifiantProjet,
      producteur: référencielFixture ? référencielFixture.producteur : producteurÀLaCandidature,
      numéroIdentification: numéro
        ? Lauréat.Producteur.NuméroIdentification.bind(numéro)
        : undefined,
    };

    return expected;
  }

  mapChangementToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
    ancienProducteur: string,
    ancienSIRET?: string,
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
        nouveau: {
          producteur: this.#enregistrerChangementProducteurFixture.producteur,
          siret: Lauréat.Producteur.NuméroIdentification.bind({
            siret: this.#enregistrerChangementProducteurFixture.siret,
          }).siret,
        },
        ancien: {
          producteur: ancienProducteur,
          siret: ancienSIRET
            ? Lauréat.Producteur.NuméroIdentification.bind({
                siret: ancienSIRET,
              }).siret
            : undefined,
        },
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
