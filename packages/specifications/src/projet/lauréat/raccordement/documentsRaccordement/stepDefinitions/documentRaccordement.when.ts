import { type DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import type { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import type { Role } from '@potentiel-domain/utilisateur';

import {
  convertFixtureFileToReadableStream,
  getRôle,
  type RôleUtilisateur,
} from '../../../../../helpers/index.js';
import type { PotentielWorld } from '../../../../../potentiel.world.js';
import type { ModifierDocument } from '../fixtures/modifierDocumentRaccordement.fixture.js';
import type { SupprimerDocument } from '../fixtures/supprimerDocumentRaccordement.fixture.js';
import type { TransmettreDocument } from '../fixtures/transmettreDocumentRaccordement.fixture.js';
import { matchTypeDocument } from './documentRaccordement.given.js';

Quand(
  `le porteur transmet un document pour le projet lauréat`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.lauréatWorld.raccordementWorld;

    try {
      await transmettreDocumentRaccordement.call(
        this,
        identifiantProjet.formatter(),
        référenceDossier,
      );
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  `le porteur transmet un document pour le projet lauréat avec :`,
  async function (this: PotentielWorld, datatable: DataTable) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.lauréatWorld.raccordementWorld;

    try {
      await transmettreDocumentRaccordement.call(
        this,
        identifiantProjet.formatter(),
        référenceDossier,
        this.lauréatWorld.raccordementWorld.documentRaccordement.mapExempleToFixtureValues(
          datatable.rowsHash(),
        ),
      );
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  /(le porteur|la dreal|la dgec) modifie le document$/,
  async function (this: PotentielWorld, rôleUtilisateur: RôleUtilisateur) {
    const { identifiantProjet } = this.lauréatWorld;

    try {
      await modifierDocumentRaccordement.call(
        this,
        identifiantProjet,
        getRôle.call(this, rôleUtilisateur),
        {},
      );
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  /le porteur modifie le document avec :$/,
  async function (this: PotentielWorld, data: DataTable) {
    const { identifiantProjet } = this.lauréatWorld;

    try {
      await modifierDocumentRaccordement.call(
        this,
        identifiantProjet,
        this.utilisateurWorld.porteurFixture.role,
        this.lauréatWorld.raccordementWorld.documentRaccordement.mapExempleToFixtureValues(
          data.rowsHash(),
        ),
      );
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  'le porteur modifie le document avec les mêmes valeurs',
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;

    const { référenceDossier, dateSignature, document } =
      this.lauréatWorld.raccordementWorld.documentRaccordement.transmettreFixture;

    try {
      await modifierDocumentRaccordement.call(this, identifiantProjet, 'porteur-projet', {
        référenceDossier,
        dateSignature,
        document,
        estUnNouveauDocument: false,
        type: this.lauréatWorld.raccordementWorld.documentRaccordement.transmettreFixture.type,
      } satisfies ModifierDocument);
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  /le porteur supprime un document (proposition technique et financière|convention de raccordement|convention directe de raccordement) pour le projet lauréat/,
  async function (this: PotentielWorld, typeDocument: string) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.lauréatWorld.raccordementWorld;
    const type = matchTypeDocument(typeDocument);

    try {
      await supprimerDocumentRaccordement.call(
        this,
        identifiantProjet.formatter(),
        'porteur-projet',
        référenceDossier,
        { type },
      );
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  /(le porteur|la dreal|la dgec) supprime un document pour le projet lauréat/,
  async function (this: PotentielWorld, rôle: RôleUtilisateur) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.lauréatWorld.raccordementWorld;

    try {
      await supprimerDocumentRaccordement.call(
        this,
        identifiantProjet.formatter(),
        getRôle.call(this, rôle),
        référenceDossier,
      );
    } catch (e) {
      this.error = e as Error;
    }
  },
);

export async function transmettreDocumentRaccordement(
  this: PotentielWorld,
  identifiantProjet: string,
  référence: string,
  data: Partial<TransmettreDocument> = {},
) {
  const { dateSignature, document, référenceDossier, type } =
    this.lauréatWorld.raccordementWorld.documentRaccordement.transmettreFixture.créer({
      identifiantProjet,
      référenceDossier: référence,
      ...data,
    });

  await mediator.send<Lauréat.Raccordement.TransmettreDocumentUseCase>({
    type: 'Lauréat.Raccordement.UseCase.TransmettreDocument',
    data: {
      dateSignatureValue: dateSignature,
      référenceDossierRaccordementValue: référenceDossier,
      identifiantProjetValue: identifiantProjet,
      documentRaccordementValue: convertFixtureFileToReadableStream(document),
      typeValue: type,
      transmisLeValue: new Date().toISOString(),
      transmisParValue: this.utilisateurWorld.porteurFixture.email,
    },
  });
}

async function modifierDocumentRaccordement(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  role: Role.RawType,
  data: Partial<ModifierDocument>,
) {
  const { dateSignature, document, référenceDossier, estUnNouveauDocument, type } =
    this.lauréatWorld.raccordementWorld.documentRaccordement.modifierFixture.créer({
      identifiantProjet: identifiantProjet.formatter(),
      référenceDossier: this.lauréatWorld.raccordementWorld.référenceDossier,
      type: this.lauréatWorld.raccordementWorld.documentRaccordement.transmettreFixture.type,
      ...data,
    });

  await mediator.send<Lauréat.Raccordement.ModifierDocumentUseCase>({
    type: 'Lauréat.Raccordement.UseCase.ModifierDocument',
    data: {
      dateSignatureValue: dateSignature,
      référenceDossierRaccordementValue: référenceDossier,
      identifiantProjetValue: identifiantProjet.formatter(),
      documentRaccordementValue: convertFixtureFileToReadableStream(document),
      estUnNouveauDocumentValue: estUnNouveauDocument,
      rôleValue: role,
      typeValue: type,
      modifiéLeValue: DateTime.now().formatter(),
      modifiéParValue: this.utilisateurWorld.récupérerEmailSelonRôle(role),
    },
  });
}

export async function supprimerDocumentRaccordement(
  this: PotentielWorld,
  identifiantProjet: string,
  role: Role.RawType,
  référence: string,
  data: Partial<SupprimerDocument> = {},
) {
  const { référenceDossier, type } =
    this.lauréatWorld.raccordementWorld.documentRaccordement.supprimerFixture.créer({
      identifiantProjet,
      référenceDossier: référence,
      type: this.lauréatWorld.raccordementWorld.documentRaccordement.transmettreFixture.type,
      ...data,
    });

  await mediator.send<Lauréat.Raccordement.SupprimerDocumentUseCase>({
    type: 'Lauréat.Raccordement.UseCase.SupprimerDocument',
    data: {
      référenceDossierRaccordementValue: référenceDossier,
      identifiantProjetValue: identifiantProjet,
      typeValue: type,
      rôleValue: role,
      suppriméLeValue: new Date().toISOString(),
      suppriméParValue: this.utilisateurWorld.récupérerEmailSelonRôle(role),
    },
  });
}
