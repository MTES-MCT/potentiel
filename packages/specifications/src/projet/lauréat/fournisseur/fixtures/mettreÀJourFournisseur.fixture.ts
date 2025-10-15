import { faker } from '@faker-js/faker';

import { Lauréat } from '@potentiel-domain/projet';

import { AbstractFixture } from '../../../../fixture';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable';

export interface EnregistrerChangementFournisseur {
  readonly évaluationCarbone: number;
  readonly fournisseurs: Array<Lauréat.Fournisseur.Fournisseur.RawType>;
  readonly raison: string;
  readonly misAJourLe: string;
  readonly misAJourPar: string;

  readonly pièceJustificative: { format: string; content: ReadableStream };
}

export class MettreÀJourFournisseurFixture
  extends AbstractFixture<EnregistrerChangementFournisseur>
  implements EnregistrerChangementFournisseur
{
  #format!: string;
  #content!: string;

  get pièceJustificative(): EnregistrerChangementFournisseur['pièceJustificative'] {
    return {
      format: this.#format,
      content: convertStringToReadableStream(this.#content),
    };
  }

  #évaluationCarbone!: number;

  get évaluationCarbone(): number {
    return this.#évaluationCarbone;
  }

  #fournisseurs!: Array<Lauréat.Fournisseur.Fournisseur.RawType>;

  get fournisseurs() {
    return this.#fournisseurs;
  }

  #raison!: string;

  get raison(): string {
    return this.#raison;
  }

  #misAJourLe!: string;

  get misAJourLe(): string {
    return this.#misAJourLe;
  }

  #misAJourPar!: string;

  get misAJourPar(): string {
    return this.#misAJourPar;
  }

  créer(
    partialFixture: Partial<Readonly<EnregistrerChangementFournisseur>> & { misAJourPar: string },
  ): Readonly<EnregistrerChangementFournisseur> {
    const content = faker.word.words();
    const fixture = {
      misAJourLe: faker.date.recent().toISOString(),
      évaluationCarbone: faker.number.float({ fractionDigits: 4 }),
      fournisseurs: faker.helpers
        .arrayElements(Lauréat.Fournisseur.TypeFournisseur.typesFournisseur)
        .map((typeFournisseur) => ({
          typeFournisseur,
          nomDuFabricant: faker.company.name(),
          lieuDeFabrication: faker.location.country(),
        })),
      raison: faker.word.words(),
      pièceJustificative: {
        format: faker.potentiel.fileFormat(),
        content: convertStringToReadableStream(content),
      },
      ...partialFixture,
    };

    this.#évaluationCarbone = fixture.évaluationCarbone;
    this.#misAJourLe = fixture.misAJourLe;
    this.#misAJourPar = fixture.misAJourPar;
    this.#fournisseurs = fixture.fournisseurs;
    this.#raison = fixture.raison;
    this.#format = fixture.pièceJustificative.format;
    this.#content = content;

    this.aÉtéCréé = true;

    return fixture;
  }
}
