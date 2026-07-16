import { faker } from '@faker-js/faker';

import { DateTime, Email } from '@potentiel-domain/common';

import { AbstractFixture } from '../../../../fixture.js';
import type { LauréatWorld } from '../../lauréat.world.js';

interface CorrigerDateAchèvement {
  readonly dateAchèvement: string;
  readonly corrigéeLe: string;
  readonly corrigéePar: string;
}

export class CorrigerDateAchèvementFixture
  extends AbstractFixture<CorrigerDateAchèvement>
  implements CorrigerDateAchèvement
{
  #dateAchèvement!: string;

  get dateAchèvement(): string {
    return this.#dateAchèvement;
  }

  #corrigéeLe!: string;

  get corrigéeLe(): string {
    return this.#corrigéeLe;
  }

  #corrigéePar!: string;

  get corrigéePar(): string {
    return this.#corrigéePar;
  }
  constructor(public readonly lauréatWorld: LauréatWorld) {
    super();
  }

  créer(partialFixture?: Partial<CorrigerDateAchèvement>): CorrigerDateAchèvement {
    const fixture: CorrigerDateAchèvement = {
      dateAchèvement: faker.date
        .between({
          from: DateTime.convertirEnValueType(
            this.lauréatWorld.notifierLauréatFixture.notifiéLe,
          ).ajouterNombreDeJours(1).date,
          to: DateTime.now().date,
        })
        .toISOString(),
      corrigéeLe: faker.date.recent().toISOString(),
      corrigéePar: faker.internet.email(),
      ...partialFixture,
    };

    this.#dateAchèvement = new Date(fixture.dateAchèvement).toISOString();
    this.#corrigéeLe = new Date(fixture.corrigéeLe).toISOString();
    this.#corrigéePar = fixture.corrigéePar;

    this.aÉtéCréé = true;

    return this;
  }

  mapToExpected() {
    return {
      dateAchèvementRéel: DateTime.convertirEnValueType(this.dateAchèvement),
      misÀJourLe: DateTime.convertirEnValueType(this.corrigéeLe),
      misÀJourPar: Email.convertirEnValueType(this.corrigéePar),
    };
  }
}
