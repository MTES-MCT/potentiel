import { faker } from '@faker-js/faker';

import { Lauréat } from '@potentiel-domain/projet';

import { AbstractFixture } from '../../../../fixture';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable';

export interface EnregistrerChangementFournisseur {
  readonly évaluationCarbone: number;
  readonly fournisseurs: Array<{
    typeFournisseur: Lauréat.Fournisseur.TypeFournisseur.RawType;
    nomDuFabricant: string;
  }>;
  readonly enregistréLe: string;
  readonly enregistréPar: string;

  readonly pièceJustificative: { format: string; content: ReadableStream };
}

export class EnregistrerChangementFournisseurFixture
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

  #fournisseurs!: Array<{
    typeFournisseur: Lauréat.Fournisseur.TypeFournisseur.RawType;
    nomDuFabricant: string;
  }>;

  get fournisseurs() {
    return this.#fournisseurs;
  }

  #enregistréLe!: string;

  get enregistréLe(): string {
    return this.#enregistréLe;
  }

  #enregistréPar!: string;

  get enregistréPar(): string {
    return this.#enregistréPar;
  }

  créer(
    partialFixture: Partial<Readonly<EnregistrerChangementFournisseur>> & { enregistréPar: string },
  ): Readonly<EnregistrerChangementFournisseur> {
    const content = faker.word.words();
    const fixture = {
      enregistréLe: faker.date.recent().toISOString(),
      évaluationCarbone: faker.number.float({ fractionDigits: 4 }),
      fournisseurs: faker.helpers
        .arrayElements(Lauréat.Fournisseur.TypeFournisseur.typesFournisseur)
        .map((typeFournisseur) => ({
          typeFournisseur,
          nomDuFabricant: faker.company.name(),
        })),
      pièceJustificative: {
        format: faker.potentiel.fileFormat(),
        content: convertStringToReadableStream(content),
      },
      ...partialFixture,
    };

    this.#évaluationCarbone = fixture.évaluationCarbone;
    this.#enregistréLe = fixture.enregistréLe;
    this.#enregistréPar = fixture.enregistréPar;
    this.#fournisseurs = fixture.fournisseurs;
    this.#format = fixture.pièceJustificative.format;
    this.#content = content;

    this.aÉtéCréé = true;

    return fixture;
  }
}
