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
import type { ModifierDocumentRaccordement } from '../fixtures/modifierDocumentRaccordement.fixture.js';
import type { TransmettreDocumentRaccordement } from '../fixtures/transmettreDocumentRaccordement.fixture.js';

Quand(
  `le porteur transmet un document de raccordement pour le projet lauréat`,
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
  `le porteur transmet un document de raccordement pour le projet lauréat avec :`,
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
  /(le porteur|la dreal|la dgec) modifie la proposition technique et financière$/,
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
  /(le porteur|la dreal|la dgec) modifie la proposition technique et financière avec :$/,
  async function (this: PotentielWorld, rôleUtilisateur: RôleUtilisateur, datatable: DataTable) {
    const { identifiantProjet } = this.lauréatWorld;

    try {
      await modifierDocumentRaccordement.call(
        this,
        identifiantProjet,
        getRôle.call(this, rôleUtilisateur),
        this.lauréatWorld.raccordementWorld.propositionTechniqueEtFinancière.mapExempleToFixtureValues(
          datatable.rowsHash(),
        ),
      );
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  'le porteur modifie la proposition technique et financière avec les mêmes valeurs',
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;

    const { référenceDossier, dateSignature, documentRaccordement } =
      this.lauréatWorld.raccordementWorld.propositionTechniqueEtFinancière.transmettreFixture;
    try {
      await modifierDocumentRaccordement.call(this, identifiantProjet, 'porteur-projet', {
        référenceDossier,
        dateSignature,
        documentRaccordement,
        estUnNouveauDocument: false,
      } satisfies ModifierDocumentRaccordement);
    } catch (e) {
      this.error = e as Error;
    }
  },
);

async function transmettreDocumentRaccordement(
  this: PotentielWorld,
  identifiantProjet: string,
  référence: string,
  data: Partial<TransmettreDocumentRaccordement> = {},
) {
  const { dateSignature, documentRaccordement, référenceDossier } =
    this.lauréatWorld.raccordementWorld.propositionTechniqueEtFinancière.transmettreFixture.créer({
      identifiantProjet,
      référenceDossier: référence,
      ...data,
    });

  await mediator.send<Lauréat.Raccordement.TransmettreDocumentRaccordementUseCase>({
    type: 'Lauréat.Raccordement.UseCase.TransmettreDocumentRaccordement',
    data: {
      dateSignatureValue: dateSignature,
      référenceDossierRaccordementValue: référenceDossier,
      identifiantProjetValue: identifiantProjet,
      documentRaccordementValue: convertFixtureFileToReadableStream(documentRaccordement),
      transmiseLeValue: new Date().toISOString(),
      transmiseParValue: this.utilisateurWorld.porteurFixture.email,
    },
  });
}

async function modifierDocumentRaccordement(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  role: Role.RawType,
  data: Partial<ModifierDocumentRaccordement>,
) {
  const { dateSignature, documentRaccordement, référenceDossier, estUnNouveauDocument } =
    this.lauréatWorld.raccordementWorld.propositionTechniqueEtFinancière.modifierFixture.créer({
      identifiantProjet: identifiantProjet.formatter(),
      référenceDossier: this.lauréatWorld.raccordementWorld.référenceDossier,
      ...data,
    });

  await mediator.send<Lauréat.Raccordement.ModifierDocumentRaccordementUseCase>({
    type: 'Lauréat.Raccordement.UseCase.ModifierDocumentRaccordement',
    data: {
      dateSignatureValue: dateSignature,
      référenceDossierRaccordementValue: référenceDossier,
      identifiantProjetValue: identifiantProjet.formatter(),
      documentRaccordementValue: convertFixtureFileToReadableStream(documentRaccordement),
      estUnNouveauDocumentValue: estUnNouveauDocument,
      rôleValue: role,
      modifiéeLeValue: DateTime.now().formatter(),
      modifiéeParValue: this.utilisateurWorld.récupérerEmailSelonRôle(role),
    },
  });
}
