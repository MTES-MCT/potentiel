import { Lauréat } from '@potentiel-domain/projet';

import { AbstractFixture } from '../../../../../fixture.js';
import type { DocumentRaccordementWorld } from '../documentRaccordement.world.js';

export type SupprimerDocumentRaccordement = {
  référenceDossier: string;
  type: Lauréat.Raccordement.TypeDocumentsRaccordement.RawType;
};

export class SupprimerDocumentRaccordementFixture
  extends AbstractFixture<SupprimerDocumentRaccordement>
  implements SupprimerDocumentRaccordement
{
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
    partialFixture: Partial<Readonly<SupprimerDocumentRaccordement>> & {
      référenceDossier: string;
      identifiantProjet: string;
    },
  ): Readonly<SupprimerDocumentRaccordement> {
    const fixture = {
      type: Lauréat.Raccordement.TypeDocumentsRaccordement.propositionTechniqueEtFinancière.type,
      ...partialFixture,
    };

    this.#identifiantProjet = fixture.identifiantProjet;
    this.#référenceDossier = fixture.référenceDossier;
    this.#type = fixture.type;
    this.aÉtéCréé = true;

    this.#world.supprimerDocument(fixture);

    return fixture;
  }
}
