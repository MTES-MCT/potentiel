import { Lauréat } from '@potentiel-domain/projet';

import { mapToExemple, mapValueType } from '#helpers';
import { AbstractFixture } from '../../../../../fixture.js';
import type { DocumentRaccordementWorld } from '../documentRaccordement.world.js';

export type ModifierTypeDocument = {
  référenceDossier: string;
  ancienType: Lauréat.Raccordement.TypeDocumentsRaccordement.RawType;
  type: Lauréat.Raccordement.TypeDocumentsRaccordement.RawType;
};

export class ModifierTypeDocumentFixture
  extends AbstractFixture<ModifierTypeDocument>
  implements ModifierTypeDocument
{
  #identifiantProjet!: string;
  get identifiantProjet(): string {
    return this.#identifiantProjet;
  }

  #référenceDossier!: string;
  get référenceDossier(): string {
    return this.#référenceDossier;
  }

  #ancienType!: Lauréat.Raccordement.TypeDocumentsRaccordement.RawType;
  get ancienType(): Lauréat.Raccordement.TypeDocumentsRaccordement.RawType {
    return this.#ancienType;
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
    partialFixture: Partial<Readonly<ModifierTypeDocument>> & {
      référenceDossier: string;
      identifiantProjet: string;
    },
  ): Readonly<ModifierTypeDocument> {
    const fixture = {
      type: Lauréat.Raccordement.TypeDocumentsRaccordement.propositionTechniqueEtFinancière.type,
      ancienType: Lauréat.Raccordement.TypeDocumentsRaccordement.conventionDeRaccordement.type,
      ...partialFixture,
    };

    this.#identifiantProjet = fixture.identifiantProjet;
    this.#référenceDossier = fixture.référenceDossier;
    this.#type = fixture.type;
    this.#ancienType = fixture.type;
    this.aÉtéCréé = true;

    this.#world.modifierTypeDocument(fixture.ancienType, fixture.type);

    return fixture;
  }

  mapExempleToFixtureValues(exemple: Record<string, string>) {
    return mapToExemple<Pick<ModifierTypeDocument, 'ancienType' | 'type'>>(exemple, {
      ancienType: [
        'document modifié',
        mapValueType(Lauréat.Raccordement.TypeDocumentsRaccordement.convertirEnValueType),
      ],
      type: [
        'nouveau type de document',
        mapValueType(Lauréat.Raccordement.TypeDocumentsRaccordement.convertirEnValueType),
      ],
    });
  }
}
