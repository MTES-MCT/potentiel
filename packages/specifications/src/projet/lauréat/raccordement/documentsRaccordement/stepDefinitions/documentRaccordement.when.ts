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
import type { ModifierDocumentRaccordement } from '../../propositionTechniqueEtFinancière/fixtures/modifierDocumentRaccordement.fixture.js';
import type { TransmettreDocumentRaccordement } from '../fixtures/transmettreDocumentRaccordement.fixture.js';

Quand(
  `le porteur transmet un document raccordement pour le projet lauréat`,
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
  `le porteur transmet un document raccordement pour le projet lauréat avec :`,
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
  /(le porteur|la dreal|la dgec) modifie la proposition le document raccordement/,
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

export async function transmettreDocumentRaccordement(
  this: PotentielWorld,
  identifiantProjet: string,
  référence: string,
  data: Partial<TransmettreDocumentRaccordement> = {},
) {
  const { dateSignature, document, référenceDossier, type } =
    this.lauréatWorld.raccordementWorld.documentRaccordement.transmettreFixture.créer({
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
      documentRaccordementValue: convertFixtureFileToReadableStream(document),
      type,
      transmisLeValue: new Date().toISOString(),
      transmisParValue: this.utilisateurWorld.porteurFixture.email,
    },
  });
}

async function modifierDocumentRaccordement(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  role: Role.RawType,
  data: Partial<ModifierDocumentRaccordement>,
) {
  const { dateSignature, document, référenceDossier } =
    this.lauréatWorld.raccordementWorld.documentRaccordement.modifierFixture.créer({
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
      documentRaccordementValue: convertFixtureFileToReadableStream(document),
      estUnNouveauDocumentValue: !!document,
      rôleValue: role,
      modifiéeLeValue: DateTime.now().formatter(),
      modifiéeParValue: this.utilisateurWorld.récupérerEmailSelonRôle(role),
    },
  });
}
