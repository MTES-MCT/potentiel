import { DateTime, Email } from '@potentiel-domain/common';
import { type IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { mapToExemple } from '#helpers';
import { CorrigerNuméroIdentificationFixture } from './fixture/corrigerNuméroIdentification.fixture.js';
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

  #corrigerNuméroIdentificationFixture: CorrigerNuméroIdentificationFixture;
  get corrigerNuméroIdentificationFixture() {
    return this.#corrigerNuméroIdentificationFixture;
  }

  constructor() {
    this.#enregistrerChangementProducteurFixture = new EnregistrerChangementProducteurFixture();
    this.#modifierProducteurFixture = new ModifierProducteurFixture();
    this.#corrigerNuméroIdentificationFixture = new CorrigerNuméroIdentificationFixture();
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
        : this.#corrigerNuméroIdentificationFixture.aÉtéCréé
          ? this.#corrigerNuméroIdentificationFixture
          : undefined;

    const référencielHasProducteur = référencielFixture && 'producteur' in référencielFixture;

    const producteur = référencielHasProducteur
      ? référencielFixture.producteur
      : producteurÀLaCandidature;

    const numéro = référencielFixture
      ? { siret: référencielFixture.siret }
      : numéroIdentificationÀLaCandidature;

    const expected: Lauréat.Producteur.ConsulterProducteurReadModel = {
      identifiantProjet,
      producteur,
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
