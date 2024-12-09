import { faker } from '@faker-js/faker';

import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { AbstractFixture } from '../../../../../fixture';
import { convertStringToReadableStream } from '../../../../../helpers/convertStringToReadable';

type PièceJustificative = { format: string; content: ReadableStream };

export type CréerDemandeChangementReprésentantLégalFixture = Partial<
  Readonly<DemanderChangementReprésentantLégal>
> & {
  identifiantProjet: string;
};

export interface DemanderChangementReprésentantLégal {
  readonly nomReprésentantLégal: string;
  readonly typeReprésentantLégal: ReprésentantLégal.TypeReprésentantLégal.ValueType;
  readonly pièceJustificative: PièceJustificative;
  readonly demandéLe: string;
  readonly demandéPar: string;
}

export class DemanderChangementReprésentantLégalFixture
  extends AbstractFixture<DemanderChangementReprésentantLégal>
  implements DemanderChangementReprésentantLégal
{
  #identifiantProjet!: string;

  get identifiantProjet(): string {
    return this.#identifiantProjet;
  }

  #nomReprésentantLégal!: string;

  get nomReprésentantLégal(): string {
    return this.#nomReprésentantLégal;
  }

  #typeReprésentantLégal!: ReprésentantLégal.TypeReprésentantLégal.ValueType;

  get typeReprésentantLégal(): ReprésentantLégal.TypeReprésentantLégal.ValueType {
    return this.#typeReprésentantLégal;
  }

  #format!: string;
  #content!: string;

  get pièceJustificative(): DemanderChangementReprésentantLégal['pièceJustificative'] {
    return {
      format: this.#format,
      content: convertStringToReadableStream(this.#content),
    };
  }

  #demandéLe!: string;

  get demandéLe(): string {
    return this.#demandéLe;
  }

  #demandéPar!: string;

  get demandéPar(): string {
    return this.#demandéPar;
  }

  #statut!: ReprésentantLégal.StatutDemandeChangementReprésentantLégal.ValueType;

  get statut(): ReprésentantLégal.StatutDemandeChangementReprésentantLégal.ValueType {
    return this.#statut;
  }

  créer(
    partialFixture: CréerDemandeChangementReprésentantLégalFixture,
  ): Readonly<DemanderChangementReprésentantLégal> {
    const content = faker.word.words();

    const fixture = {
      statut: ReprésentantLégal.StatutDemandeChangementReprésentantLégal.demandé,
      nomReprésentantLégal: faker.person.fullName(),
      typeReprésentantLégal: ReprésentantLégal.TypeReprésentantLégal.personneMorale,
      pièceJustificative: {
        format: 'application/pdf',
        content: convertStringToReadableStream(content),
      },
      demandéLe: faker.date.recent().toISOString(),
      demandéPar: faker.internet.email(),
      ...partialFixture,
    };

    this.#identifiantProjet = fixture.identifiantProjet;
    this.#nomReprésentantLégal = fixture.nomReprésentantLégal;
    this.#typeReprésentantLégal = fixture.typeReprésentantLégal;
    this.#format = fixture.pièceJustificative.format;
    this.#content = content;
    this.#demandéLe = fixture.demandéLe;
    this.#demandéPar = fixture.demandéPar;
    this.#statut = fixture.statut;

    this.aÉtéCréé = true;

    return fixture;
  }
}
