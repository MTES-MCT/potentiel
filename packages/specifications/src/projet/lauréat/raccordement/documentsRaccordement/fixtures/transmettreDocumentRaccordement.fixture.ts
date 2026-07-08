import { faker } from '@faker-js/faker';

import { Lauréat } from '@potentiel-domain/projet';

import type { PièceJustificative } from '#helpers';
import { AbstractFixture } from '../../../../../fixture.js';
import type { DocumentRaccordementWorld } from '../documentRaccordement.world.js';

export type TransmettreDocument = {
  dateSignature: string;
  référenceDossier: string;
  document: PièceJustificative;
  type: Lauréat.Raccordement.TypeDocumentsRaccordement.RawType;
};

export class TransmettreDocumentFixture
  extends AbstractFixture<TransmettreDocument>
  implements TransmettreDocument
{
  #dateSignature!: string;
  get dateSignature(): string {
    return this.#dateSignature;
  }

  #document!: PièceJustificative;
  get document(): PièceJustificative {
    return this.#document;
  }

  #type!: Lauréat.Raccordement.TypeDocumentsRaccordement.RawType;
  get type(): Lauréat.Raccordement.TypeDocumentsRaccordement.RawType {
    return this.#type;
  }

  #identifiantProjet!: string;
  get identifiantProjet(): string {
    return this.#identifiantProjet;
  }

  #référenceDossier!: string;
  get référenceDossier(): string {
    return this.#référenceDossier;
  }

  #world: DocumentRaccordementWorld;

  constructor(world: DocumentRaccordementWorld) {
    super();
    this.#world = world;
  }

  créer(
    partialFixture: Partial<Readonly<TransmettreDocument>> & {
      référenceDossier: string;
      identifiantProjet: string;
    },
  ): Readonly<TransmettreDocument> {
    const fixture = {
      dateSignature: faker.date.recent().toISOString(),
      document: faker.potentiel.document(),
      type: Lauréat.Raccordement.TypeDocumentsRaccordement.propositionTechniqueEtFinancière.type,
      ...partialFixture,
    };

    this.#identifiantProjet = fixture.identifiantProjet;
    this.#dateSignature = fixture.dateSignature;
    this.#référenceDossier = fixture.référenceDossier;
    this.#document = fixture.document;
    this.#type = fixture.type;
    this.aÉtéCréé = true;

    this.#world.ajouterDocument(fixture);

    return fixture;
  }
}
