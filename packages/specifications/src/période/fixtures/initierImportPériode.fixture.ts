import { faker } from '@faker-js/faker';

import type { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';

import { getValidFakeIdentifiantProjet } from '../../candidature/fixtures/importerCandidature.fixture.js';
import { AbstractFixture } from '../../fixture.js';

type Instruction = {
  identifiantProjet: IdentifiantProjet.RawType;
} & Candidature.Instruction.RawType;

interface InitierImportPériode {
  instruction: Array<Instruction>;
  initiéLe: string;
  initiéPar: string;
}

export class InitierImportPériodeFixture
  extends AbstractFixture<InitierImportPériode>
  implements InitierImportPériode
{
  #instruction!: InitierImportPériode['instruction'];

  get instruction(): InitierImportPériode['instruction'] {
    return this.#instruction;
  }

  #initiéLe!: InitierImportPériode['initiéLe'];

  get initiéLe(): InitierImportPériode['initiéLe'] {
    return this.#initiéLe;
  }

  #initiéPar!: InitierImportPériode['initiéPar'];

  get initiéPar(): InitierImportPériode['initiéPar'] {
    return this.#initiéPar;
  }

  créer(partialFixture?: Partial<InitierImportPériode>): InitierImportPériode {
    const fixture: InitierImportPériode = {
      initiéLe: faker.date.recent().toISOString(),
      initiéPar: faker.internet.email(),
      instruction: [
        {
          identifiantProjet: getValidFakeIdentifiantProjet({
            appelOffre: 'PPE2 - Eolien',
          }).formatter(),
          statut: 'classé',
        },
      ],
      ...partialFixture,
    };

    this.#instruction = fixture.instruction;

    this.aÉtéCréé = true;

    return fixture;
  }
}
