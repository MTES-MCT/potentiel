import { faker } from '@faker-js/faker';

import type { Lauréat } from '@potentiel-domain/projet';

import type { PièceJustificative } from '#helpers';
import { AbstractFixture } from '../../../../../fixture.js';
import type { DocumentRaccordementWorld } from '../documentRaccordement.world.js';

export type ModifierDocument = {
  dateSignature: string;
  référenceDossier: string;
  document: PièceJustificative;
  estUnNouveauDocument: boolean;
  type: Lauréat.Raccordement.TypeDocumentsRaccordement.RawType;
};

export class ModifierDocumentFixture
  extends AbstractFixture<ModifierDocument>
  implements ModifierDocument
{
  #dateSignature!: string;
  get dateSignature(): string {
    return this.#dateSignature;
  }

  #document!: PièceJustificative;
  get document(): PièceJustificative {
    return this.#document;
  }

  #identifiantProjet!: string;
  get identifiantProjet(): string {
    return this.#identifiantProjet;
  }

  #référenceDossier!: string;
  get référenceDossier(): string {
    return this.#référenceDossier;
  }

  #estUnNouveauDocument!: boolean;
  get estUnNouveauDocument(): boolean {
    return this.#estUnNouveauDocument;
  }

  #type!: Lauréat.Raccordement.TypeDocumentsRaccordement.RawType;
  get type(): Lauréat.Raccordement.TypeDocumentsRaccordement.RawType {
    return this.#type;
  }

  #world: DocumentRaccordementWorld;

  constructor(world: DocumentRaccordementWorld) {
    super();
    this.#world = world;
  }

  créer(
    partialFixture: Partial<Readonly<ModifierDocument>> & {
      référenceDossier: string;
      type: Lauréat.Raccordement.TypeDocumentsRaccordement.RawType;
      identifiantProjet: string;
    },
  ): Readonly<ModifierDocument> {
    const fixture = {
      dateSignature: faker.date.recent().toISOString(),
      document: faker.potentiel.document(),
      estUnNouveauDocument: true,
      ...partialFixture,
    };

    this.#identifiantProjet = fixture.identifiantProjet;
    this.#dateSignature = fixture.dateSignature;
    this.#référenceDossier = fixture.référenceDossier;
    this.#document = fixture.document;
    this.#estUnNouveauDocument = fixture.estUnNouveauDocument;
    this.#type = fixture.type;
    this.aÉtéCréé = true;

    this.#world.ajouterDocument(fixture);

    return fixture;
  }
}
