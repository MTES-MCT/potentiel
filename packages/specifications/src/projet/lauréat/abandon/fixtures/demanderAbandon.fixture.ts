import { faker } from '@faker-js/faker';

import { PièceJustificative } from '#helpers';

import { AbstractFixture } from '../../../../fixture.js';

interface DemanderAbandon {
  readonly demandéLe: string;
  readonly demandéPar: string;
  readonly raison: string;
  readonly recandidature: boolean;
  readonly pièceJustificative?: PièceJustificative;
}

export class DemanderAbandonFixture
  extends AbstractFixture<DemanderAbandon>
  implements DemanderAbandon
{
  #pièceJustificative?: PièceJustificative;
  get pièceJustificative(): PièceJustificative | undefined {
    return this.#pièceJustificative;
  }

  #demandéLe!: string;

  get demandéLe(): string {
    return this.#demandéLe;
  }

  #demandéPar!: string;

  get demandéPar(): string {
    return this.#demandéPar;
  }

  #raison!: string;

  get raison(): string {
    return this.#raison;
  }

  #recandidature!: boolean;

  get recandidature(): boolean {
    return this.#recandidature;
  }

  #identifiantProjet!: string;

  get identifiantProjet(): string {
    return this.#identifiantProjet;
  }

  créer(
    partialFixture: Partial<Readonly<DemanderAbandon>> & { identifiantProjet: string },
  ): Readonly<DemanderAbandon> {
    const fixture = {
      demandéLe: faker.date.recent().toISOString(),
      demandéPar: faker.internet.email(),
      raison: faker.word.words(),
      recandidature: false,
      ...partialFixture,
    };

    this.#demandéLe = fixture.demandéLe;
    this.#demandéPar = fixture.demandéPar;
    this.#raison = fixture.raison;
    this.#recandidature = fixture.recandidature;
    this.#identifiantProjet = fixture.identifiantProjet;

    if (!fixture.recandidature) {
      fixture.pièceJustificative = faker.potentiel.document();
      this.#pièceJustificative = fixture.pièceJustificative;
    }

    this.aÉtéCréé = true;
    return fixture;
  }
}
