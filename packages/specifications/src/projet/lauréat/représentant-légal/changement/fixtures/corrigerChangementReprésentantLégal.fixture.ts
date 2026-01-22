import { faker } from '@faker-js/faker';

import { Lauréat } from '@potentiel-domain/projet';

import { AbstractFixture } from '../../../../../fixture.js';
import { convertStringToReadableStream } from '../../../../../helpers/convertStringToReadable.js';

type PièceJustificative = { format: string; content: ReadableStream };

export type CréerCorrectionChangementReprésentantLégalFixture = Partial<
  Readonly<CorrigerChangementReprésentantLégal>
> & {
  identifiantProjet: string;
};

export interface CorrigerChangementReprésentantLégal {
  readonly nomReprésentantLégal: string;
  readonly typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.ValueType;
  readonly pièceJustificative: PièceJustificative;
  readonly corrigéLe: string;
  readonly corrigéPar: string;
}

export class CorrigerChangementReprésentantLégalFixture
  extends AbstractFixture<CorrigerChangementReprésentantLégal>
  implements CorrigerChangementReprésentantLégal
{
  #identifiantProjet!: string;

  get identifiantProjet(): string {
    return this.#identifiantProjet;
  }

  #nomReprésentantLégal!: string;

  get nomReprésentantLégal(): string {
    return this.#nomReprésentantLégal;
  }

  #typeReprésentantLégal!: Lauréat.ReprésentantLégal.TypeReprésentantLégal.ValueType;

  get typeReprésentantLégal(): Lauréat.ReprésentantLégal.TypeReprésentantLégal.ValueType {
    return this.#typeReprésentantLégal;
  }

  #format!: string;
  #content!: string;

  get pièceJustificative(): CorrigerChangementReprésentantLégal['pièceJustificative'] {
    return {
      format: this.#format,
      content: convertStringToReadableStream(this.#content),
    };
  }

  #corrigéLe!: string;

  get corrigéLe(): string {
    return this.#corrigéLe;
  }

  #corrigéPar!: string;

  get corrigéPar(): string {
    return this.#corrigéPar;
  }

  #statut!: Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.ValueType;

  get statut(): Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.ValueType {
    return this.#statut;
  }

  créer(
    partialFixture: CréerCorrectionChangementReprésentantLégalFixture,
  ): Readonly<CorrigerChangementReprésentantLégal> {
    const content = faker.word.words();

    const fixture = {
      statut: Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.demandé,
      nomReprésentantLégal: faker.person.fullName(),
      typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.personneMorale,
      corrigéLe: faker.date.recent().toISOString(),
      corrigéPar: faker.internet.email(),
      pièceJustificative: {
        format: 'application/pdf',
        content: convertStringToReadableStream(content),
      },
      ...partialFixture,
    };

    this.#format = fixture.pièceJustificative.format;
    this.#content = content;

    this.#identifiantProjet = fixture.identifiantProjet;
    this.#nomReprésentantLégal = fixture.nomReprésentantLégal;
    this.#typeReprésentantLégal = fixture.typeReprésentantLégal;
    this.#corrigéLe = fixture.corrigéLe;
    this.#corrigéPar = fixture.corrigéPar;
    this.#statut = fixture.statut;

    this.aÉtéCréé = true;

    return fixture;
  }
}
