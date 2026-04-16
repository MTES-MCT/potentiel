import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';
import { DateTime } from '@potentiel-domain/common';

import { PotentielWorld } from '../../../potentiel.world.js';
import { convertStringToReadableStream, getRôle, RôleUtilisateur } from '../../../helpers/index.js';
import { ModifierPropositionTechniqueEtFinancière } from '../fixtures/modifierPropositionTechniqueEtFinancière.fixture.js';
import { TransmettrePropositionTechniqueEtFinancière } from '../fixtures/transmettrePropositionTechniqueEtFinancière.fixture.js';

Quand(
  `le porteur transmet une proposition technique et financière pour le projet lauréat`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;

    try {
      await transmettrePropositionTechniqueEtFinancière.call(
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
  `le porteur transmet une proposition technique et financière pour le projet lauréat avec :`,
  async function (this: PotentielWorld, datatable: DataTable) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;

    try {
      await transmettrePropositionTechniqueEtFinancière.call(
        this,
        identifiantProjet.formatter(),
        référenceDossier,
        this.raccordementWorld.propositionTechniqueEtFinancière.mapExempleToFixtureValues(
          datatable.rowsHash(),
        ),
      );
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  /(le porteur|la dreal|l'utilisateur dgec) modifie la proposition technique et financière$/,
  async function (this: PotentielWorld, rôleUtilisateur: RôleUtilisateur) {
    const { identifiantProjet } = this.lauréatWorld;

    try {
      await modifierPropositionTechniqueEtFinancière.call(
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
  /(le porteur|la dreal|l'utilisateur dgec) modifie la proposition technique et financière avec :$/,
  async function (this: PotentielWorld, rôleUtilisateur: RôleUtilisateur, datatable: DataTable) {
    const { identifiantProjet } = this.lauréatWorld;

    try {
      await modifierPropositionTechniqueEtFinancière.call(
        this,
        identifiantProjet,
        getRôle.call(this, rôleUtilisateur),
        this.raccordementWorld.propositionTechniqueEtFinancière.mapExempleToFixtureValues(
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

    const { référenceDossier, dateSignature, propositionTechniqueEtFinancièreSignée } =
      this.raccordementWorld.propositionTechniqueEtFinancière.transmettreFixture;
    try {
      await modifierPropositionTechniqueEtFinancière.call(
        this,
        identifiantProjet,
        'porteur-projet',
        {
          référenceDossier,
          dateSignature,
          propositionTechniqueEtFinancièreSignée,
          estUnNouveauDocument: false,
        } satisfies ModifierPropositionTechniqueEtFinancière,
      );
    } catch (e) {
      this.error = e as Error;
    }
  },
);

async function transmettrePropositionTechniqueEtFinancière(
  this: PotentielWorld,
  identifiantProjet: string,
  référence: string,
  data: Partial<TransmettrePropositionTechniqueEtFinancière> = {},
) {
  const { dateSignature, propositionTechniqueEtFinancièreSignée, référenceDossier } =
    this.raccordementWorld.propositionTechniqueEtFinancière.transmettreFixture.créer({
      identifiantProjet,
      référenceDossier: référence,
      ...data,
    });

  await mediator.send<Lauréat.Raccordement.TransmettrePropositionTechniqueEtFinancièreUseCase>({
    type: 'Lauréat.Raccordement.UseCase.TransmettrePropositionTechniqueEtFinancière',
    data: {
      dateSignatureValue: dateSignature,
      référenceDossierRaccordementValue: référenceDossier,
      identifiantProjetValue: identifiantProjet,
      propositionTechniqueEtFinancièreSignéeValue: {
        format: propositionTechniqueEtFinancièreSignée.format,
        content: convertStringToReadableStream(propositionTechniqueEtFinancièreSignée.content),
      },
      transmiseLeValue: new Date().toISOString(),
      transmiseParValue: this.utilisateurWorld.porteurFixture.email,
    },
  });
}

async function modifierPropositionTechniqueEtFinancière(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  role: Role.RawType,
  data: Partial<ModifierPropositionTechniqueEtFinancière>,
) {
  const {
    dateSignature,
    propositionTechniqueEtFinancièreSignée,
    référenceDossier,
    estUnNouveauDocument,
  } = this.raccordementWorld.propositionTechniqueEtFinancière.modifierFixture.créer({
    identifiantProjet: identifiantProjet.formatter(),
    référenceDossier: this.raccordementWorld.référenceDossier,
    ...data,
  });

  await mediator.send<Lauréat.Raccordement.ModifierPropositionTechniqueEtFinancièreUseCase>({
    type: 'Lauréat.Raccordement.UseCase.ModifierPropositionTechniqueEtFinancière',
    data: {
      dateSignatureValue: dateSignature,
      référenceDossierRaccordementValue: référenceDossier,
      identifiantProjetValue: identifiantProjet.formatter(),
      propositionTechniqueEtFinancièreSignéeValue: {
        format: propositionTechniqueEtFinancièreSignée.format,
        content: convertStringToReadableStream(propositionTechniqueEtFinancièreSignée.content),
      },
      estUnNouveauDocumentValue: estUnNouveauDocument,
      rôleValue: role,
      modifiéeLeValue: DateTime.now().formatter(),
      modifiéeParValue: this.utilisateurWorld.récupérerEmailSelonRôle(role),
    },
  });
}
